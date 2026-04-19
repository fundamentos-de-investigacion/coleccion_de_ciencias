import { supabase } from '../api/supabase';

class MediaService {
  async uploadMedia(file, specimenId, caption = '') {
    const { data: { user } } = await supabase.auth.getUser();
    
    // 1. Upload file to Supabase Storage
    const fileName = `${specimenId}/${Date.now()}_${file.name}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from('specimen-media')
      .upload(fileName, file);

    if (storageError) {
      console.error('Error uploading to storage:', storageError);
      throw storageError;
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('specimen-media')
      .getPublicUrl(fileName);

    // 3. Save to database
    const { data, error } = await supabase
      .from('specimen_media')
      .insert([{
        specimen_id: specimenId,
        url: publicUrl,
        type: file.type.startsWith('image/') ? 'image' : (file.type.startsWith('audio/') ? 'audio' : 'document'),
        caption,
        user_id: user?.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving media to DB:', error);
      throw error;
    }

    return data;
  }

  async getBySpecimen(specimenId) {
    const { data, error } = await supabase
      .from('specimen_media')
      .select('*')
      .eq('specimen_id', specimenId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching media:', error);
      return [];
    }
    return data;
  }

  async delete(mediaId, filePath) {
    // 1. Delete from storage if filePath is provided
    if (filePath) {
      const storagePath = filePath.split('specimen-media/')[1];
      await supabase.storage.from('specimen-media').remove([storagePath]);
    }

    // 2. Delete from DB
    const { error } = await supabase
      .from('specimen_media')
      .delete()
      .eq('id', mediaId);

    if (error) {
      console.error('Error deleting media from DB:', error);
      throw error;
    }
    return true;
  }
}

export default new MediaService();
