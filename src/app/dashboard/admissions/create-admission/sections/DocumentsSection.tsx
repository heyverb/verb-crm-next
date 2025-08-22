import { UseFormReturn, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { CreateAdmissionSchema } from "@/appwrite/schema/admission.schema";
import ControlledSelect from "@/components/common/ControlledSelect";
import CommonFileInput from "@/components/common/CommonFileInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { enumToArray } from "@/lib/utils";
import {
  GuardianDocumentTypeEnum,
  StudentDocumentTypeEnum,
} from "@/appwrite/interface/admission.interface";
import { Plus, Trash2, FileText, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type FormData = z.infer<typeof CreateAdmissionSchema>;

interface DocumentsSectionProps {
  form: UseFormReturn<FormData>;
}

export function DocumentsSection({ form }: DocumentsSectionProps) {
  const {
    fields: guardianFields,
    append: appendGuardian,
    remove: removeGuardian,
  } = useFieldArray({
    control: form.control,
    name: "guardian_document",
  });

  const {
    fields: studentFields,
    append: appendStudent,
    remove: removeStudent,
  } = useFieldArray({
    control: form.control,
    name: "student_document",
  });

  return (
    <div className="space-y-6">
      <Alert>
        <Upload className="h-4 w-4" />
        <AlertDescription>
          Please upload clear, readable copies of all required documents. Accepted formats: PDF, JPG, PNG (Max 5MB each)
        </AlertDescription>
      </Alert>

      {/* Guardian Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Guardian Documents</CardTitle>
          <CardDescription>
            Upload documents related to the guardian/parent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {guardianFields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-end">
              <div className="flex-1 grid gap-4 sm:grid-cols-2">
                <ControlledSelect<FormData, `guardian_document.${number}.name`>
                  control={form.control}
                  name={`guardian_document.${index}.name`}
                  label={index === 0 ? "Document Type" : undefined}
                  placeholder="Select document type"
                  options={enumToArray(GuardianDocumentTypeEnum)}
                />
                <CommonFileInput<FormData, `guardian_document.${number}.url`>
                  control={form.control}
                  name={`guardian_document.${index}.url`}
                  label={index === 0 ? "Upload Document" : undefined}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeGuardian(index)}
                disabled={guardianFields.length === 1}
                className="mb-1"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendGuardian({ name: "", url: "" })}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Document
          </Button>
        </CardContent>
      </Card>

      {/* Student Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Student Documents</CardTitle>
          <CardDescription>
            Upload documents related to the student
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {studentFields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-end">
              <div className="flex-1 grid gap-4 sm:grid-cols-2">
                <ControlledSelect<FormData, `student_document.${number}.name`>
                  control={form.control}
                  name={`student_document.${index}.name`}
                  label={index === 0 ? "Document Type" : undefined}
                  placeholder="Select document type"
                  options={enumToArray(StudentDocumentTypeEnum)}
                />
                <CommonFileInput<FormData, `student_document.${number}.url`>
                  control={form.control}
                  name={`student_document.${index}.url`}
                  label={index === 0 ? "Upload Document" : undefined}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeStudent(index)}
                disabled={studentFields.length === 1}
                className="mb-1"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendStudent({ name: "", url: "" })}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Document
          </Button>
        </CardContent>
      </Card>

      {/* Document Requirements */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Document Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <p className="font-medium mb-2">Guardian Documents:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Aadhaar Card / PAN Card</li>
                <li>• Address Proof</li>
                <li>• Income Certificate (if applicable)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Student Documents:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Birth Certificate</li>
                <li>• Previous School TC</li>
                <li>• Marksheets (if applicable)</li>
                <li>• Medical Certificate</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}