"use client";

import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RatingSelector } from "./RatingSelector";
import UploadImages from "@/components/UploadImage";
import { Description, DialogClose } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function WriteReviewDialog({
  productId,
  isLoggedIn,
  onSuccess,
}: {
  productId: number;
  isLoggedIn: boolean;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [files, setFiles] = React.useState<File[]>([]);
  const [loading, setLoading] = React.useState(false);

  const { errors, setErrors, clearError } = useFieldErrors<{
    title: string;
    comment: string;
    rating: string;
    username: string;
    email: string;
  }>();

  // form field refs for easy reset
  const formRef = React.useRef<HTMLFormElement>(null);

  // reset form whenever the dialog closes
  React.useEffect(() => {
    if (!open) {
      setRating(0);
      setErrors({});
      formRef.current?.reset();
    }
  }, [open]);

  async function submit(formData: FormData) {
    debugger;
    setErrors({});
    const title = String(formData.get("title") || "").trim();
    const comment = String(formData.get("comment") || "").trim();

    // 1️⃣ Upload files to Strapi first
    let uploadedIds: number[] = [];
    if (files.length) {
      const uploadForm = new FormData();
      files.forEach((file) => uploadForm.append("files", file));
      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
        {
          method: "POST",
          body: uploadForm,
        }
      );
      const uploaded = await uploadRes.json();
      uploadedIds = uploaded.map((f: any) => f.id);
    }
    // 2️⃣ Build review payload
    const payload: any = {
      product: productId,
      rating,
      title,
      comment,
      upload_images: uploadedIds, // Strapi media relation
    };

    if (!isLoggedIn) {
      payload.username = String(formData.get("username") || "").trim();
      payload.email = String(formData.get("email") || "").trim();
    }

    // 3️⃣ Validate locally
    const errs: Record<string, string> = {};
    if (!rating) errs.rating = "Please select a rating.";
    if (!title) errs.title = "Title is required.";
    if (comment.length < 10)
      errs.comment = "Comment must be at least 10 characters.";
    if (!isLoggedIn) {
      if (!payload.username) errs.username = "Your name is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))
        errs.email = "Valid email is required.";
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });
      setOpen(false); // will trigger the reset effect
      if (isLoggedIn && onSuccess) onSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Write a review</Button>
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
        <form ref={formRef} action={submit}>
          <div className="flex items-center flex-col justify-center mt-6 mb-10">
            {/* <label className="block text-sm mb-1">Rating</label> */}
            <RatingSelector
              value={rating}
              onChange={(value: number) => {
                setRating(value);
                clearError("rating", String(value));
              }}
              size={40}
            />
            {errors.rating && (
              <p className="text-xs text-red-500 mt-1">{errors.rating}</p>
            )}
          </div>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="space-y-4">
              <div>
                {/* <label className="block text-sm mb-1">Title</label> */}
                <Input
                  name="title"
                  placeholder="Give your review a title"
                  // onChange={(e) => clearError("title", e.target.value)}
                />
                {/* {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )} */}
              </div>

              <div>
                {/* <label className="block text-sm mb-1">Comment</label> */}
                <Textarea
                  name="comment"
                  rows={4}
                  placeholder="Share details about your experience"
                  onChange={(e) => clearError("comment", e.target.value)}
                />
                {errors.comment && (
                  <p className="text-xs text-red-500 mt-1">{errors.comment}</p>
                )}
              </div>

              <UploadImages
                value={files}
                onChange={setFiles}
                maxFiles={2}
                maxSizeMB={1}
              />

              {!isLoggedIn && (
                <>
                  <div>
                    {/* <label className="block text-sm mb-1">Your name</label> */}
                    <Input
                      name="username"
                      placeholder="Your name"
                      onChange={(e) => clearError("username", e.target.value)}
                    />
                    {errors.username && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.username}
                      </p>
                    )}
                  </div>
                  <div>
                    {/* <label className="block text-sm mb-1">Email</label> */}
                    <Input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      onChange={(e) => clearError("email", e.target.value)}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function useFieldErrors<T extends Record<string, string>>() {
  const [errors, setErrors] = React.useState<Partial<T>>({});
  const clearError = (name: keyof T, value: string) => {
    if (errors[name] && value.trim().length > 0) {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest as Partial<T>;
      });
    }
  };
  return { errors, setErrors, clearError };
}
