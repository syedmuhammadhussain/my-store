"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Description, DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import ReviewForm from "./ReviewForm";

export default function WriteReviewDialog({
  productId,
  onSuccess,
}: {
  productId: number;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="sm:w-[180px]">Write a review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-white" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="sm:text-xl text-center mt-2">
            Write your review
          </DialogTitle>
        </DialogHeader>
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-5.5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>
        <Description className="sr-only"></Description>

        <ReviewForm
          productId={productId}
          onSuccess={() => {
            setOpen(false);
            onSuccess?.();
          }}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
