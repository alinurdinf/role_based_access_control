"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon, SearchIcon, FilterIcon, MoreVerticalIcon, XIcon } from "lucide-react";
import { RoleWithDetails } from "@/lib/types";
import { RoleDetail } from "@/components/role-detail";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const initialRolesData: RoleWithDetails[] = [
  {
    role_id: 1,
    role_name: "Admin",
    created_by: "system",
    description: "Admin role",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    objects: [
      {
        object_id: 1,
        object_type: "UID",
        object_value: "alinurdinf",
        role_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      }
    ],
    accesses: [
      {
        rbac: {
          rbac_id: 1,
          role_id: 1,
          app_id: "MF",
          program_code: "ALL",
          created_by: "system",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null,
        },
        access: [
          {
            access_id: 1,
            rbac_id: 1,
            access: "create",
            created_by: "system",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
          }
        ]
      }
    ]
  }
];

// Available object types and access types for the form
const objectTypes = ["UID", "DEPARTMENT", "LOCATION", "TEAM"];
const accessTypes = ["open", "create", "read", "update", "delete", "approve"];
const applications = ["MF", "HRIS", "SNAP", "FINANCE"];

export default function RBACDashboard() {
  const [rolesData, setRolesData] = useState<RoleWithDetails[]>(initialRolesData);
  const [selectedRole, setSelectedRole] = useState<RoleWithDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newRole, setNewRole] = useState({
    role_name: "",
    description: "",
    objects: [] as Array<{ object_type: string; object_value: string }>,
    accesses: [] as Array<{
      app_id: string;
      program_code: string;
      permissions: string[];
    }>,
  });
  const [currentAccess, setCurrentAccess] = useState({
    app_id: "",
    program_code: "",
    permission: "",
  });
  const [roleCreationMode, setRoleCreationMode] = useState<"new" | "existing">("new");
  const [selectedExistingRole, setSelectedExistingRole] = useState<string>("");

  const filteredRoles = rolesData.filter(role =>
    role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRole = () => {
    // Handle empty roles case
    const maxRoleId = rolesData.length > 0 ? Math.max(...rolesData.map(r => r.role_id)) : 0;
    const maxObjectId = rolesData.length > 0 ? Math.max(...rolesData.flatMap(r => r.objects.map(o => o.object_id))) : 0;
    const maxRbacId = rolesData.length > 0 ? Math.max(...rolesData.flatMap(r => r.accesses.map(a => a.rbac.rbac_id))) : 0;
    const maxAccessId = rolesData.length > 0 ? Math.max(...rolesData.flatMap(r =>
      r.accesses.flatMap(a => a.access.map(ac => ac.access_id)))) : 0;

    if (roleCreationMode === "existing" && selectedExistingRole) {
      const existingRole = rolesData.find(role => role.role_id.toString() === selectedExistingRole);
      if (existingRole) {
        const newRoleData: RoleWithDetails = {
          ...existingRole,
          role_id: maxRoleId + 1,
          role_name: `${existingRole.role_name} (Copy)`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          objects: existingRole.objects.map((obj, idx) => ({
            ...obj,
            object_id: maxObjectId + idx + 1,
            role_id: maxRoleId + 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })),
          accesses: existingRole.accesses.map((access, idx) => ({
            rbac: {
              ...access.rbac,
              rbac_id: maxRbacId + idx + 1,
              role_id: maxRoleId + 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            access: access.access.map((a, permIdx) => ({
              ...a,
              access_id: maxAccessId + permIdx + 1,
              rbac_id: maxRbacId + idx + 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })),
          })),
        };
        setRolesData([...rolesData, newRoleData]);
      }
    } else {
      const newRoleData: RoleWithDetails = {
        role_id: maxRoleId + 1,
        role_name: newRole.role_name,
        description: newRole.description || "",
        created_by: "admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        objects: newRole.objects.map((obj, idx) => ({
          object_id: maxObjectId + idx + 1,
          object_type: obj.object_type,
          object_value: obj.object_value,
          role_id: maxRoleId + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null,
        })),
        accesses: newRole.accesses.map((access, idx) => ({
          rbac: {
            rbac_id: maxRbacId + idx + 1,
            role_id: maxRoleId + 1,
            app_id: access.app_id,
            program_code: access.program_code,
            created_by: "admin",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
          },
          access: access.permissions.map((perm, permIdx) => ({
            access_id: maxAccessId + permIdx + 1,
            rbac_id: maxRbacId + idx + 1,
            access: perm,
            created_by: "admin",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
          })),
        })),
      };

      setRolesData([...rolesData, newRoleData]);
    }

    // Reset form
    setNewRole({
      role_name: "",
      description: "",
      objects: [],
      accesses: [],
    });
    setSelectedExistingRole("");
    setRoleCreationMode("new");
  };

  const handleAddObject = () => {
    setNewRole({
      ...newRole,
      objects: [...newRole.objects, { object_type: "", object_value: "" }],
    });
  };

  const handleAddAccess = () => {
    if (currentAccess.app_id && currentAccess.program_code && currentAccess.permission) {
      const existingAccessIndex = newRole.accesses.findIndex(
        a => a.app_id === currentAccess.app_id && a.program_code === currentAccess.program_code
      );

      if (existingAccessIndex >= 0) {
        // Add permission to existing access group
        const updatedAccesses = [...newRole.accesses];
        updatedAccesses[existingAccessIndex].permissions.push(currentAccess.permission);
        setNewRole({ ...newRole, accesses: updatedAccesses });
      } else {
        // Create new access group
        setNewRole({
          ...newRole,
          accesses: [
            ...newRole.accesses,
            {
              app_id: currentAccess.app_id,
              program_code: currentAccess.program_code,
              permissions: [currentAccess.permission],
            },
          ],
        });
      }

      setCurrentAccess({ app_id: "", program_code: "", permission: "" });
    }
  };

  const handleExistingRoleSelect = (roleId: string) => {
    const role = rolesData.find(r => r.role_id.toString() === roleId);
    if (role) {
      setNewRole({
        role_name: `${role.role_name} (Copy)`,
        description: role.description || "",
        objects: role.objects.map(obj => ({
          object_type: obj.object_type,
          object_value: obj.object_value,
        })),
        accesses: role.accesses.map(access => ({
          app_id: access.rbac.app_id,
          program_code: access.rbac.program_code,
          permissions: access.access.map(a => a.access),
        })),
      });
    }
  };



  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Role-Based Access Control</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <FilterIcon className="mr-2 h-4 w-4" />
            Filter
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <RadioGroup
                  defaultValue="new"
                  className="flex gap-4"
                  onValueChange={(value: "new" | "existing") => setRoleCreationMode(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new-role" />
                    <Label htmlFor="new-role">Create New Role</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="existing" id="existing-role" />
                    <Label htmlFor="existing-role">Copy Existing Role</Label>
                  </div>
                </RadioGroup>

                {roleCreationMode === "existing" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="existing-role-select" className="text-right">
                      Select Role
                    </Label>
                    <Select
                      value={selectedExistingRole}
                      onValueChange={(value) => {
                        setSelectedExistingRole(value);
                        handleExistingRoleSelect(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role to copy" />
                      </SelectTrigger>
                      <SelectContent>
                        {rolesData.map((role) => (
                          <SelectItem key={role.role_id} value={role.role_id.toString()}>
                            {role.role_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role-name" className="text-right">
                    Role Name
                  </Label>
                  <Input
                    id="role-name"
                    value={newRole.role_name}
                    onChange={(e) => setNewRole({ ...newRole, role_name: e.target.value })}
                    className="col-span-3"
                    placeholder="Enter role name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    className="col-span-3"
                    placeholder="Enter role description"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="block">Assigned Objects</Label>
                  <div className="space-y-2">
                    {newRole.objects.map((obj, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Select
                          value={obj.object_type}
                          onValueChange={(value) => {
                            const updatedObjects = [...newRole.objects];
                            updatedObjects[index].object_type = value;
                            setNewRole({ ...newRole, objects: updatedObjects });
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {objectTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          value={obj.object_value}
                          onChange={(e) => {
                            const updatedObjects = [...newRole.objects];
                            updatedObjects[index].object_value = e.target.value;
                            setNewRole({ ...newRole, objects: updatedObjects });
                          }}
                          placeholder="Enter value"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updatedObjects = [...newRole.objects];
                            updatedObjects.splice(index, 1);
                            setNewRole({ ...newRole, objects: updatedObjects });
                          }}
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={handleAddObject}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add Object
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="block">Access Rights</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <Select
                        value={currentAccess.app_id}
                        onValueChange={(value) =>
                          setCurrentAccess({ ...currentAccess, app_id: value })
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Application" />
                        </SelectTrigger>
                        <SelectContent>
                          {applications.map((app) => (
                            <SelectItem key={app} value={app}>
                              {app}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={currentAccess.program_code}
                        onChange={(e) =>
                          setCurrentAccess({ ...currentAccess, program_code: e.target.value })
                        }
                        placeholder="Program code"
                      />
                      <Select
                        value={currentAccess.permission}
                        onValueChange={(value) =>
                          setCurrentAccess({ ...currentAccess, permission: value })
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Permission" />
                        </SelectTrigger>
                        <SelectContent>
                          {accessTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddAccess}>
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {newRole.accesses.map((access, index) => (
                        <div key={index} className="p-3 border rounded">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">
                              {access.app_id} - {access.program_code}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedAccesses = [...newRole.accesses];
                                updatedAccesses.splice(index, 1);
                                setNewRole({ ...newRole, accesses: updatedAccesses });
                              }}
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {access.permissions.map((perm, permIndex) => (
                              <Badge
                                key={permIndex}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {perm}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4"
                                  onClick={() => {
                                    const updatedAccesses = [...newRole.accesses];
                                    updatedAccesses[index].permissions.splice(permIndex, 1);
                                    if (updatedAccesses[index].permissions.length === 0) {
                                      updatedAccesses.splice(index, 1);
                                    }
                                    setNewRole({ ...newRole, accesses: updatedAccesses });
                                  }}
                                >
                                  <XIcon className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    onClick={handleAddRole}
                    disabled={
                      roleCreationMode === "existing"
                        ? !selectedExistingRole
                        : !newRole.role_name
                    }
                  >
                    {roleCreationMode === "existing" ? "Copy Role" : "Create Role"}
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search roles..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <RoleDetail role={selectedRole} onClose={() => setSelectedRole(null)} />

      <Tabs defaultValue="roles">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="objects">Objects</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Roles</CardTitle>
              <CardDescription>Manage user roles and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role ID</TableHead>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Objects</TableHead>
                    <TableHead>Access Rights</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rolesData.map((role) => (
                    <TableRow key={role.role_id}>
                      <TableCell>{role.role_id}</TableCell>
                      <TableCell className="font-medium">{role.role_name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.objects.map((obj) => (
                            <Badge key={obj.object_id} variant="outline">
                              {obj.object_type}: {obj.object_value}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.accesses.flatMap((accessGroup) =>
                            accessGroup.access.map((access) => (
                              <Badge key={access.access_id} variant="secondary">
                                {accessGroup.rbac.app_id} - {accessGroup.rbac.program_code}: {access.access}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="objects">
          <Card>
            <CardHeader>
              <CardTitle>Object-Role Assignments</CardTitle>
              <CardDescription>Manage which objects are assigned to which roles</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Object ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rolesData.flatMap((role) =>
                    role.objects.map((obj) => (
                      <TableRow key={obj.object_id}>
                        <TableCell>{obj.object_id}</TableCell>
                        <TableCell>{obj.object_type}</TableCell>
                        <TableCell>{obj.object_value}</TableCell>
                        <TableCell>{role.role_name}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>Manage what each role can do in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Application</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rolesData.flatMap((role) =>
                    role.accesses.map((accessGroup) => (
                      <TableRow key={accessGroup.rbac.rbac_id}>
                        <TableCell>{role.role_name}</TableCell>
                        <TableCell>{accessGroup.rbac.app_id}</TableCell>
                        <TableCell>{accessGroup.rbac.program_code}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {accessGroup.access.map((access) => (
                              <Badge key={access.access_id} variant="secondary">
                                {access.access}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}