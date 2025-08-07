"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";
import { RoleWithDetails } from "@/lib/types";

interface RoleDetailProps {
    role: RoleWithDetails | null;
    onClose: () => void;
}

export function RoleDetail({ role, onClose }: RoleDetailProps) {
    if (!role) return null;

    return (
        <Dialog open={!!role} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Role Details: {role.role_name}</DialogTitle>
                    <div className="absolute right-4 top-4">
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <XIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role-id" className="text-right">
                            Role ID
                        </Label>
                        <Input id="role-id" value={role.role_id} className="col-span-3" readOnly />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role-name" className="text-right">
                            Role Name
                        </Label>
                        <Input id="role-name" value={role.role_name} className="col-span-3" />
                    </div>

                    <div className="space-y-2">
                        <Label className="block">Assigned Objects</Label>
                        <div className="flex flex-wrap gap-2 p-2 border rounded">
                            {role.objects.map((obj) => (
                                <Badge key={obj.object_id} variant="outline" className="flex items-center gap-1">
                                    {obj.object_type}: {obj.object_value}
                                    <Button variant="ghost" size="icon" className="h-4 w-4">
                                        <XIcon className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ))}
                            <Button variant="outline" size="sm">
                                + Add Object
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="block">Access Rights</Label>
                        <div className="space-y-4">
                            {role.accesses.map((accessGroup) => (
                                <div key={accessGroup.rbac.rbac_id} className="p-3 border rounded">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">
                                            {accessGroup.rbac.app_id} - {accessGroup.rbac.program_code}
                                        </span>
                                        <Button variant="ghost" size="sm">
                                            Remove
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {accessGroup.access.map((access) => (
                                            <Badge key={access.access_id} variant="secondary" className="flex items-center gap-1">
                                                {access.access}
                                                <Button variant="ghost" size="icon" className="h-4 w-4">
                                                    <XIcon className="h-3 w-3" />
                                                </Button>
                                            </Badge>
                                        ))}
                                        <Button variant="outline" size="sm">
                                            + Add Permission
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full">
                                + Add Access Group
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button>Save Changes</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}