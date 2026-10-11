export function makeUploader({ api, getProfile, getActive, onRecord, onFinish, toast }) {
  return async function processFiles(files, type = 'Other') {
    const profileId = getActive();
    const profile = getProfile(profileId);
    if (!profile || !files?.length) return;
    let completed = 0;
    toast(`Uploading ${files.length} record${files.length === 1 ? '' : 's'}…`);
    for (const file of files) {
      const form = new FormData();
      form.append('file', file);
      form.append('type', type);
      form.append('title', file.name.replace(/\.[^.]+$/, ''));
      try {
        const result = await api(`/api/profiles/${profileId}/documents`, { method: 'POST', body: form });
        profile.docs.unshift(result.document);
        completed++;
        onRecord(profileId, result.document);
      } catch (error) {
        toast(`${file.name} could not be processed: ${error.message}`);
      }
    }
    if (completed) {
      onFinish(profileId);
      toast(`${completed} health record${completed === 1 ? '' : 's'} uploaded and added to this profile’s history.`);
    }
  };
}
