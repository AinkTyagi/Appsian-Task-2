# Entity Relationship Diagram

```
┌─────────────────────────────────────┐
│              User                    │
├─────────────────────────────────────┤
│ Id (PK, GUID)                       │
│ Email (Unique, Required)            │
│ PasswordHash (Required)             │
│ CreatedAt (DateTime)                │
└─────────────────────────────────────┘
                │
                │ 1:N
                │
                ▼
┌─────────────────────────────────────┐
│            Project                   │
├─────────────────────────────────────┤
│ Id (PK, GUID)                       │
│ UserId (FK, GUID)                   │
│ Title (Required, 3-100 chars)       │
│ Description (Optional, ≤500 chars)  │
│ CreatedAt (DateTime)                │
│                                     │
│ Indexes:                            │
│  - (UserId, CreatedAt)              │
└─────────────────────────────────────┘
                │
                │ 1:N
                │
                ▼
┌─────────────────────────────────────┐
│           TaskItem                   │
├─────────────────────────────────────┤
│ Id (PK, GUID)                       │
│ ProjectId (FK, GUID)                │
│ Title (Required, ≤200 chars)        │
│ DueDate (Optional, DateTime)        │
│ IsCompleted (Boolean)               │
│ CreatedAt (DateTime)                │
│                                     │
│ Indexes:                            │
│  - (ProjectId, CreatedAt)           │
└─────────────────────────────────────┘

Relationships:
- User → Projects: One-to-Many (Cascade Delete)
- Project → TaskItems: One-to-Many (Cascade Delete)

Notes:
- All primary keys are GUIDs
- Foreign keys enforce referential integrity
- Cascade delete ensures orphaned records are removed
- Indexes optimize query performance for user/project filtering
```
