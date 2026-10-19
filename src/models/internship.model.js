export const internshipFieldColumns = Object.freeze({
  title: "title",
  company: "company",
  domain: "domain",
  location: "location",
  duration: "duration",
  stipend: "stipend",
  description: "description",
  status: "status",
});

export const mapInternshipRow = (row) => ({
  _id: row.id,
  title: row.title,
  company: row.company,
  domain: row.domain,
  location: row.location,
  duration: row.duration,
  stipend: Number(row.stipend),
  description: row.description,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
