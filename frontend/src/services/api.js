const API_BASE = `${process.env.REACT_APP_API_BASE_URL}/api/resume`;

/**
 * Upload resume with role selection
 */
export async function uploadResume(file, name, email, phone, roleId) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);
  formData.append("email", email);
  if (phone) formData.append("phone", phone);
  formData.append("roleId", roleId);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Upload failed");
  }
  return res.json();
}

/**
 * Get all job roles
 */
export async function getAllRoles() {
  const res = await fetch(`${API_BASE}/roles`);
  if (!res.ok) throw new Error("Failed to fetch roles");
  return res.json();
}

/**
 * Get candidates with server-side pagination and role filtering
 */
export async function getAllCandidates(page = 0, roleId = "") {
  const url = roleId 
    ? `${API_BASE}/candidates?page=${page}&roleId=${roleId}`
    : `${API_BASE}/candidates?page=${page}`;
    
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch talent pool");
  return res.json();
}

/**
 * Search candidates by name or email (Matches backend @RequestParam)
 */
export async function searchCandidates(query, page = 0) {
  const res = await fetch(`${API_BASE}/candidates/search?query=${query}&page=${page}`);
  if (!res.ok) throw new Error("Search operation failed");
  return res.json();
}

/**
 * Get candidate by ID
 */
export async function getCandidateById(id) {
  const res = await fetch(`${API_BASE}/candidates/${id}`);
  if (!res.ok) throw new Error("Failed to fetch candidate profile");
  return res.json();
}

/**
 * Delete candidate
 */
export async function deleteCandidate(id) {
  const res = await fetch(`${API_BASE}/candidates/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Deletion failed");
  return res.json();
}

/**
 * Update candidate status (e.g., SHORTLISTED, REJECTED)
 */
export async function updateCandidateStatus(id, status) {
  const res = await fetch(`${API_BASE}/candidates/${id}/status?status=${status}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to update candidate status");
  return res.json();
}