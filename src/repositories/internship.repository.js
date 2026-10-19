import { randomUUID } from "node:crypto";
import { pool } from "../config/database.js";
import { internshipFieldColumns, mapInternshipRow } from "../models/internship.model.js";
import ApiError from "../utils/ApiError.js";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const sortColumns = Object.freeze({
  createdAt: "created_at",
  title: "title",
  stipend: "stipend",
});
const returningColumns =
  "id, title, company, domain, location, duration, stipend, description, status, created_at, updated_at";

const validateId = (id) => {
  if (!uuidPattern.test(id)) {
    throw new ApiError(400, "Invalid internship ID");
  }
};

const throwIfMissing = (row) => {
  if (!row) {
    throw new ApiError(404, "Internship not found");
  }
};

const buildWhereClause = (filters) => {
  const clauses = [];
  const values = [];
  const addValue = (value) => {
    values.push(value);
    return `$${values.length}`;
  };

  if (filters.domain) {
    clauses.push(`LOWER(domain) = LOWER(${addValue(filters.domain)})`);
  }

  if (filters.location) {
    clauses.push(`LOWER(location) = LOWER(${addValue(filters.location)})`);
  }

  if (filters.status) {
    clauses.push(`status = ${addValue(filters.status)}`);
  }

  if (filters.search) {
    const searchParameter = addValue(filters.search);
    clauses.push(
      `(POSITION(LOWER(${searchParameter}) IN LOWER(title)) > 0
        OR POSITION(LOWER(${searchParameter}) IN LOWER(company)) > 0
        OR POSITION(LOWER(${searchParameter}) IN LOWER(domain)) > 0
        OR POSITION(LOWER(${searchParameter}) IN LOWER(description)) > 0)`,
    );
  }

  return {
    sql: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    values,
  };
};

export const createInternship = async (internshipData) => {
  const fields = Object.keys(internshipFieldColumns);
  const values = fields.map((field) => internshipData[field]);
  const placeholders = fields.map((_, index) => `$${index + 2}`);
  const columns = fields.map((field) => internshipFieldColumns[field]);

  const { rows } = await pool.query(
    `INSERT INTO internships (id, ${columns.join(", ")})
     VALUES ($1, ${placeholders.join(", ")})
     RETURNING ${returningColumns}`,
    [randomUUID(), ...values],
  );

  return mapInternshipRow(rows[0]);
};

export const getAllInternships = async ({
  page = 1,
  limit = 10,
  filters = {},
  sortBy = "createdAt",
  order = "desc",
}) => {
  const { sql: whereClause, values } = buildWhereClause(filters);
  const sortColumn = sortColumns[sortBy] ?? sortColumns.createdAt;
  const sortDirection = order === "asc" ? "ASC" : "DESC";

  const countResult = await pool.query(
    `SELECT COUNT(*)::bigint AS total FROM internships ${whereClause}`,
    values,
  );
  const offset = (page - 1) * limit;
  const dataResult = await pool.query(
    `SELECT ${returningColumns}
     FROM internships
     ${whereClause}
     ORDER BY ${sortColumn} ${sortDirection}, id ASC
     LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, limit, offset],
  );

  return {
    data: dataResult.rows.map(mapInternshipRow),
    totalRecords: Number(countResult.rows[0].total),
  };
};

export const getInternshipById = async (id) => {
  validateId(id);

  const { rows } = await pool.query(`SELECT ${returningColumns} FROM internships WHERE id = $1`, [
    id,
  ]);
  throwIfMissing(rows[0]);

  return mapInternshipRow(rows[0]);
};

const updateInternshipFields = async (id, internshipData) => {
  validateId(id);

  const fields = Object.keys(internshipData);
  const columns = fields.map((field) => internshipFieldColumns[field]);

  if (columns.some((column) => !column)) {
    throw new ApiError(400, "Invalid internship field");
  }

  const assignments = columns.map((column, index) => `${column} = $${index + 2}`);
  const values = fields.map((field) => internshipData[field]);
  assignments.push("updated_at = NOW()");

  const { rows } = await pool.query(
    `UPDATE internships
     SET ${assignments.join(", ")}
     WHERE id = $1
     RETURNING ${returningColumns}`,
    [id, ...values],
  );
  throwIfMissing(rows[0]);

  return mapInternshipRow(rows[0]);
};

export const updateInternship = async (id, internshipData) =>
  updateInternshipFields(id, internshipData);

export const patchInternship = async (id, internshipData) =>
  updateInternshipFields(id, internshipData);

export const deleteInternship = async (id) => {
  validateId(id);

  const { rows } = await pool.query("DELETE FROM internships WHERE id = $1 RETURNING id", [id]);
  throwIfMissing(rows[0]);

  return {
    id: rows[0].id,
    deleted: true,
  };
};
