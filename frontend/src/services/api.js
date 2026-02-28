import axiosClient from './axiosClient';

export async function uploadResume(file, name, email, phone, roleId) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);
  formData.append("email", email);
  if (phone) formData.append("phone", phone);
  formData.append("roleId", roleId);

  try {
    const res = await axiosClient.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Upload failed");
  }
}

export async function bulkUploadResume(files, roleId) {
  const formData = new FormData();
  Array.from(files).forEach(file => formData.append("files", file));
  formData.append("roleId", roleId);

  try {
    const res = await axiosClient.post('/resume/bulk-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Bulk upload failed");
  }
}

export async function getAllRoles() {
  const res = await axiosClient.get('/roles');
  return res.data;
}

export async function createRole(roleData) {
  const res = await axiosClient.post('/roles', roleData);
  return res.data;
}

export async function searchCandidates(keyword, roleId = "", status = "", minScore = "") {
  let url = '/resume/candidates?';
  if (keyword) url += `keyword=${keyword}&`;
  if (roleId) url += `roleId=${roleId}&`;
  if (status) url += `status=${status}&`;
  if (minScore) url += `minScore=${minScore}&`;

  const res = await axiosClient.get(url);
  return res.data;
}

export async function getAllCandidates(page = 0, roleId = "") {
  return searchCandidates("", roleId);
}

export async function getCandidateById(id) {
  const res = await axiosClient.get(`/resume/candidates/${id}`);
  return res.data;
}

export async function deleteCandidate(id) {
  const res = await axiosClient.delete(`/resume/candidates/${id}`);
  return res.data;
}

export async function updateCandidateStatus(id, status) {
  const res = await axiosClient.patch(`/resume/candidates/${id}/status`, { status });
  return res.data;
}

export async function reanalyzeCandidate(id) {
  const res = await axiosClient.post(`/resume/reanalyze/${id}`);
  return res.data;
}