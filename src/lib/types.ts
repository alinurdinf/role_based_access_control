// types.ts
export type Role = {
    role_id: number;
    role_name: string;
    description: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type ObjectRole = {
    object_id: number;
    object_type: string;
    object_value: string;
    role_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type RoleBasedAccess = {
    rbac_id: number;
    role_id: number;
    app_id: string;
    program_code: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type Access = {
    access_id: number;
    rbac_id: number;
    access: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type RoleWithDetails = Role & {
    objects: ObjectRole[];
    accesses: {
        rbac: RoleBasedAccess;
        access: Access[];
    }[];
};