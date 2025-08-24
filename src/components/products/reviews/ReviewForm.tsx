"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { RatingSelector } from "./RatingSelector";
import UploadImages from "@/components/UploadImage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import { getReviewSchema } from "@/lib/validation";

export default function WriteReviewForm({
  productId,
  onSuccess,
  setOpen,
}: {
  productId: number;
  setOpen: (key: boolean) => void;
  onSuccess?: () => void;
}) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  // build schema using actual login state
  const schema = getReviewSchema(!!session);

  // type inference from schema
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: 0,
      title: "",
      comment: "",
      username: "",
      email: "",
      files: [],
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    // formState: { errors },
  } = form;

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      let uploadedIds: number[] = [];
      if (values.files?.length) {
        const uploadForm = new FormData();
        values.files.forEach((file) => uploadForm.append("files", file));
        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/upload`,
          { method: "POST", body: uploadForm }
        );
        const uploaded = await uploadRes.json();
        uploadedIds = uploaded.map((f: any) => f.id);
      }

      const payload: any = {
        product: productId,
        rating: values.rating,
        title: values.title,
        comment: values.comment,
        upload_media: uploadedIds,
      };
      if (!session) {
        payload.username = values.username;
        payload.email = values.email;
      }

      await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session ? `Bearer ${session.jwt}` : "",
        },
        body: JSON.stringify({ data: payload }),
      });

      toast.success(
        session
          ? "Review has been created."
          : "Review submitted and awaiting approval",
        { className: "bg-card text-card-foreground border-border" }
      );

      session && onSuccess?.();
      reset();
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center mt-6 mb-10">
        <Controller
          control={control}
          name="rating"
          render={({ field, fieldState }) => (
            <>
              <RatingSelector
                value={field.value}
                onChange={field.onChange}
                size={40}
              />
              {fieldState.error && (
                <p className="animate-in slide-in-from-bottom text-xs text-red-500 mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      <ScrollArea className="h-[300px] w-full rounded-md border">
        <div className="space-y-4 p-4">
          <Controller
            control={control}
            name="title"
            render={({ field, fieldState }) => (
              <div>
                <Input placeholder="Give your review a title" {...field} />
                {fieldState.error && (
                  <p className="animate-in slide-in-from-bottom text-xs text-red-500 mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name="comment"
            render={({ field, fieldState }) => (
              <div>
                <Textarea
                  rows={4}
                  placeholder="Share details about your experience"
                  {...field}
                />
                {fieldState.error && (
                  <p className="animate-in slide-in-from-bottom text-xs text-red-500 mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name="files"
            render={({ field }) => (
              <UploadImages
                value={field.value || []}
                onChange={field.onChange}
                maxFiles={2}
                maxSizeMB={1}
              />
            )}
          />

          {!session && (
            <>
              <Controller
                control={control}
                name="username"
                render={({ field, fieldState }) => (
                  <div>
                    <Input placeholder="Your name" {...field} />
                    {fieldState.error && (
                      <p className="animate-in slide-in-from-bottom text-xs text-red-500 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <div>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                    {fieldState.error && (
                      <p className="animate-in slide-in-from-bottom text-xs text-red-500 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </>
          )}
        </div>
      </ScrollArea>

      <Button
        disabled={loading}
        type="submit"
        className="mt-4 w-full text-sm font-bold"
      >
        {loading ? (
          <Loader2Icon className="animate-spin w-4 h-4" />
        ) : (
          "Submit review"
        )}
      </Button>
    </form>
  );
}
