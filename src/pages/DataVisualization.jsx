import React from 'react';
import { useSpecimens } from '../context/SpecimenContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { PieChart as PieIcon, BarChart as BarIcon, TrendingUp, Filter } from 'lucide-react';

const DataVisualization = () => {
  const { specimens, metrics } = useSpecimens();

  const COLORS = ['#4caf50', '#2196f3', '#ffeb3b', '#f44336', '#9c27b0', '#ff9800', '#00bcd4'];

  const kingdomData = Object.keys(metrics.byKingdom).map(key => ({
    name: key,
    value: metrics.byKingdom[key]
  }));

  const classData = Object.keys(metrics.byClass).map(key => ({
    name: key,
    count: metrics.byClass[key]
  })).sort((a, b) => b.count - a.count);

  const timelineData = Object.keys(metrics.byDate)
    .sort((a, b) => new Date(a) - new Date(b))
    .map(key => ({
      date: key,
      count: metrics.byDate[key]
    }));

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: 'var(--font-size-xxl)', color: 'var(--primary-dark)', marginBottom: '10px' }}>Métricas y Visualizaciones</h1>
        <p style={{ color: 'var(--text-muted)' }}>Análisis estadístico de la composición y crecimiento de la colección.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px' }}>
        {/* Kingdom Distribution */}
        <div className="sci-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <PieIcon size={20} color="var(--primary)" /> Proporción por Reino
          </h3>
          <div style={{ width: '100%', height: '350px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={kingdomData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {kingdomData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temporal Trends */}
        <div className="sci-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <TrendingUp size={20} color="var(--secondary)" /> Tendencia de Registros
          </h3>
          <div style={{ width: '100%', height: '350px' }}>
            <ResponsiveContainer>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" fontSize={10} stroke="var(--text-muted)" />
                <YAxis fontSize={10} stroke="var(--text-muted)" />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="var(--secondary)" fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Class Bar Chart */}
        <div className="sci-card" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <BarIcon size={20} color="var(--warning)" /> Especímenes por Clase Taxonómica
          </h3>
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer>
              <BarChart data={classData} layout="vertical" margin={{ left: 50, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" fontSize={12} stroke="var(--text-muted)" axisLine={false} />
                <YAxis dataKey="name" type="category" fontSize={12} stroke="var(--text-main)" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'var(--surface)'}} />
                <Bar dataKey="count" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: 'var(--surface)', 
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
      }}>
        <div style={{ 
          backgroundColor: 'var(--primary-light)', 
          padding: '15px', 
          borderRadius: '50%',
          color: 'var(--primary-dark)'
        }}>
          <Filter size={24} />
        </div>
        <div>
          <h4 style={{ marginBottom: '5px' }}>Análisis de Datos Derivados</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Estas visualizaciones se calculan en tiempo real a partir de la fuente de verdad global (Single Source of Truth). 
            Cualquier cambio en el catálogo se refleja de forma reactiva e instantánea en todas las gráficas mediante el estado derivado en el Contexto de React.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
