import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../api/supabase';
import specimenService from '../services/specimenService';
import auditService from '../services/auditService';
import { normalizeSpecimenData } from '../utils/normalizationUtils';

const SpecimenContext = createContext();

export const SpecimenProvider = ({ children }) => {
  const [specimens, setSpecimens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await specimenService.getAll();
      setSpecimens(data);
      setLoading(false);
    };
    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'specimens' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSpecimens(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setSpecimens(prev => prev.map(s => s.occurrenceID === payload.new.occurrenceID ? payload.new : s));
          } else if (payload.eventType === 'DELETE') {
            setSpecimens(prev => prev.filter(s => s.occurrenceID !== payload.old.occurrenceID));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addNotification = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  };

  /**
   * Migration Logic: Sync localStorage researchers' data to Supabase
   */
  const syncLocalData = async () => {
    try {
      setLoading(true);
      const localData = localStorage.getItem('bio_collection_specimens');
      if (!localData) {
        addNotification('No se encontraron datos locales para sincronizar', 'info');
        setLoading(false);
        return;
      }

      const parsedData = JSON.parse(localData);
      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        addNotification('La colección local está vacía o es inválida', 'info');
        setLoading(false);
        return;
      }

      // 1. Normalize and ensure UUIDs for legacy data
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      const cleanedData = parsedData
        .filter(item => item && item.scientificName) // Must have at least a name
        .map(item => {
          const normalized = normalizeSpecimenData(item);
          
          // If no occurrenceID (legacy) or invalid UUID format (e.g. test placeholders), generate a real one
          const currentId = normalized.occurrenceID;
          if (!currentId || typeof currentId !== 'string' || !uuidRegex.test(currentId)) {
            normalized.occurrenceID = crypto.randomUUID();
          }
          return normalized;
        });

      if (cleanedData.length === 0) {
        addNotification('Los datos locales no son compatibles con el sistema actual', 'warning');
        setLoading(false);
        return;
      }

      await specimenService.merge(cleanedData);
      localStorage.removeItem('bio_collection_specimens'); // Clear after successful sync
      
      const updatedData = await specimenService.getAll();
      setSpecimens(updatedData);
      
      addNotification(`¡Éxito! ${parsedData.length} registros han sido migrados a la nube`, 'success', 5000);
    } catch (error) {
      console.error('Migration failed:', error);
      addNotification(`Error de sincronización: ${error.message}`, 'error', 10000);
    } finally {
      setLoading(false);
    }
  };

  const addSpecimen = async (data) => {
    try {
      const newSpecimen = await specimenService.create(data);
      addNotification('Especimen registrado en la nube con éxito');
      return newSpecimen;
    } catch (error) {
      addNotification('Error al registrar especimen', 'error');
      throw error;
    }
  };

  const updateSpecimen = async (id, data) => {
    try {
      const oldSpecimen = specimens.find(s => s.occurrenceID === id);
      const updated = await specimenService.update(id, data);
      
      // Audit tracking
      if (oldSpecimen) {
        const auditChanges = {};
        const fieldsToTrack = ['scientificName', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'locality', 'decimalLatitude', 'decimalLongitude'];
        
        fieldsToTrack.forEach(field => {
          if (oldSpecimen[field] !== data[field] && data[field] !== undefined) {
            auditChanges[field] = {
              old: oldSpecimen[field] || 'N/A',
              new: data[field]
            };
          }
        });

        if (Object.keys(auditChanges).length > 0) {
          await auditService.logChange(id, auditChanges, 'Corrección taxonómica/geográfica estándar');
        }
      }

      addNotification('Especimen actualizado correctamente');
      return updated;
    } catch (error) {
      addNotification('Error al actualizar especimen', 'error');
      throw error;
    }
  };

  const deleteSpecimen = async (id) => {
    try {
      await specimenService.delete(id);
      // setSpecimens is handled by real-time subscription
      addNotification('Especimen eliminado de la colección', 'warning');
    } catch (error) {
      addNotification('Error al eliminar especimen', 'error');
    }
  };

  const resetCollection = async () => {
    const data = await specimenService.reset();
    setSpecimens(data);
    addNotification('Colección restablecida a valores predeterminados');
  };

  const importData = async (data, mode = 'merge') => {
    try {
      let newData;
      if (mode === 'replace') {
        const { data: { user } } = await supabase.auth.getUser();
        // Delete all first for this user
        await supabase.from('specimens').delete().eq('user_id', user.id);
        await supabase.from('specimens').insert(data.map(item => ({ ...item, user_id: user.id })));
        newData = await specimenService.getAll();
      } else {
        newData = await specimenService.merge(data);
      }
      setSpecimens(newData);
      addNotification(`Se importaron ${data.length} registros correctamente`);
      return { success: true };
    } catch (e) {
      console.error('Import failed', e);
      addNotification('Error al importar datos', 'error');
      return { success: false, error: e.message };
    }
  };

  /**
   * Derived State: Metrics for Dashboard
   */
  const metrics = useMemo(() => {
    const total = specimens.length;
    const byKingdom = specimens.reduce((acc, s) => {
      acc[s.kingdom] = (acc[s.kingdom] || 0) + 1;
      return acc;
    }, {});
    
    const byClass = specimens.reduce((acc, s) => {
      acc[s.class] = (acc[s.class] || 0) + 1;
      return acc;
    }, {});

    const byDate = specimens.reduce((acc, s) => {
      const date = s.eventDate || 'Sin fecha';
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return { total, byKingdom, byClass, byDate };
  }, [specimens]);

  return (
    <SpecimenContext.Provider value={{
      specimens,
      loading,
      metrics,
      notifications,
      addSpecimen,
      updateSpecimen,
      deleteSpecimen,
      resetCollection,
      importData,
      syncLocalData,
      addNotification
    }}>
      {children}
    </SpecimenContext.Provider>
  );
};

export const useSpecimens = () => {
  const context = useContext(SpecimenContext);
  if (!context) throw new Error('useSpecimens must be used within a SpecimenProvider');
  return context;
};
