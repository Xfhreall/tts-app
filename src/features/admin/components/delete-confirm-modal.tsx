"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useDeletePuzzleMutation } from "@/shared/repository/puzzle";

interface DeleteConfirmModalProps {
  puzzleId: string;
  puzzleTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteConfirmModal({
  puzzleId,
  puzzleTitle,
  onClose,
  onSuccess,
}: DeleteConfirmModalProps) {
  const deleteMutation = useDeletePuzzleMutation();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(puzzleId);
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
          <h2 className="text-lg font-semibold">Hapus Puzzle</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-start gap-3 mb-6">
          <div className="p-2 rounded-lg bg-destructive/10">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="font-medium">Apakah Anda yakin ingin menghapus puzzle ini?</p>
            <p className="text-sm text-muted-foreground mt-1">
              &quot;{puzzleTitle}&quot; akan dihapus secara permanen.
            </p>
          </div>
        </div>

        {deleteMutation.error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
            Gagal menghapus puzzle
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
}
