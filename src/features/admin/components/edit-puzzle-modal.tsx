"use client";

import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { useUpdatePuzzleMutation } from "@/shared/repository/puzzle";

interface EditPuzzleModalProps {
  puzzle: {
    id: string;
    title: string;
    published: boolean;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export function EditPuzzleModal({ puzzle, onClose, onSuccess }: EditPuzzleModalProps) {
  const [title, setTitle] = useState(puzzle.title);
  const [published, setPublished] = useState(puzzle.published);
  const updateMutation = useUpdatePuzzleMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateMutation.mutateAsync({
        id: puzzle.id,
        data: { title, published },
      });
      onSuccess();
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 cursor-default"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-label="Close modal"
      />
      <div className="relative bg-card rounded-xl border p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Edit Puzzle</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium mb-2">
              Judul
            </label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={updateMutation.isPending}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="space-y-0.5">
              <Label htmlFor="edit-published" className="text-sm font-medium cursor-pointer">
                Published
              </Label>
              <p className="text-xs text-muted-foreground">
                {published ? "Puzzle dapat dimainkan" : "Puzzle disembunyikan"}
              </p>
            </div>
            <Switch
              id="edit-published"
              checked={published}
              onCheckedChange={setPublished}
              disabled={updateMutation.isPending}
            />
          </div>

          {updateMutation.error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              Gagal menyimpan perubahan
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
