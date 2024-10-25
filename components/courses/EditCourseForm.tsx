"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RichEditor from "@/components/custom/RichEditor";
import { ComboBox } from "../custom/ComboBox";
import FileUpload from "../custom/FileUpload";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required and must be at least 2 character long",
  }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
  subCategoryId: z.string().min(1, {
    message: "Subcategory is required",
  }),
  levelId: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.coerce.number().optional(),
});

interface EditCourseFormProps {
  course: Course;
  categories: {
    label: string; //name of category
    value: string; // categoryId
    subCategories: { label: string; value: string }[];
  }[];
  levels: { label: string; value: string }[];
}

const EditCourseForm = ({
  course,
  categories,
  levels,
}: EditCourseFormProps) => {
  const router = useRouter()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course.title,
      subtitle: course.subtitle || "",
      description: course.description || "",
      categoryId: course.categoryId,
      subCategoryId: course.subCategoryId,
      levelId: course.levelId || "",
      imageUrl: course.imageUrl || "",
      price: course.price || undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${course.id}`, values)
      toast.success("Course Updated")
      router.refresh()
    } catch (err) {
      console.log("Failed to update new course", err)
      toast.error("Something went wrong!")
    }
   }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Web Development for Beginners"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex:Became a Full.stack Develiper with just one course. HTML, Javascript, etc"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <RichEditor
                  placeholder="What is this course about?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-wrap gap-10">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <ComboBox options={categories} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="subCategoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Subcategory</FormLabel>
                <FormControl>
                  <ComboBox
                    options={
                      categories.find(
                        (category) => category.value == form.watch("categoryId")
                      )?.subCategories || []
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="levelId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Level</FormLabel>
                <FormControl>
                  <ComboBox options={levels} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
        </div>
        <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Couse Banner</FormLabel>
                <FormControl>
                <FileUpload 
                value={field.value || ""}
                onChange={(url) => field.onChange(url)}
                endpoint="courseBanner"    
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

<FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="29.99"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-5">
          <Link href="/instructor/courses"><Button variant="outline" type="button">Cancel</Button></Link>
          
        <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};

export default EditCourseForm;
