import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { CreateAdmissionSchema } from "@/appwrite/schema/admission.schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Users,
  Home,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

type FormData = z.infer<typeof CreateAdmissionSchema>;

interface ReviewSectionProps {
  form: UseFormReturn<FormData>;
}

export function ReviewSection({ form }: ReviewSectionProps) {
  const values = form.watch();
  const errors = form.formState.errors;
  const hasErrors = Object.keys(errors).length > 0;

  const getDocumentName = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix all errors before submitting the application.
          </AlertDescription>
        </Alert>
      )}

      {/* Student Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-medium">
              {values.fname} {values.lname}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date of Birth</p>
            <p className="font-medium">
              {values.dob ? format(new Date(values.dob), "dd MMM yyyy") : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gender</p>
            <p className="font-medium">{values.gender || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Blood Group</p>
            <p className="font-medium">{values.bloodgroup || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Caste</p>
            <p className="font-medium">{values.cast || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Religion</p>
            <p className="font-medium">{values.religion || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Preferred Class</p>
            <p className="font-medium">{values.preferred_class || "-"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Guardian Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Guardian Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Guardian Name</p>
            <p className="font-medium">
              {values.guardian_first_name} {values.guardian_last_name}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Relationship</p>
            <p className="font-medium">{values.guardian_relation || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Phone className="h-3 w-3" /> Phone
            </p>
            <p className="font-medium">{values.guardian_phone || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" /> Email
            </p>
            <p className="font-medium">{values.guardian_email || "-"}</p>
          </div>
          {values.guardian_occupation && (
            <div className="sm:col-span-2">
              <p className="text-sm text-muted-foreground">Occupation</p>
              <p className="font-medium">{values.guardian_occupation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <p className="font-medium">
                {[
                  values.flat_no,
                  values.address_line1,
                  values.address_line2,
                ].filter(Boolean).join(", ")}
              </p>
              <p className="text-sm text-muted-foreground">
                {values.city}, {values.state} - {values.pincode}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Uploaded Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Guardian Documents */}
          <div>
            <p className="text-sm font-medium mb-2">Guardian Documents</p>
            <div className="space-y-2">
              {values.guardian_document.filter(doc => doc.name && doc.url).map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                  <span className="text-sm">{getDocumentName(doc.name)}</span>
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Uploaded
                  </Badge>
                </div>
              ))}
              {values.guardian_document.filter(doc => doc.name && doc.url).length === 0 && (
                <p className="text-sm text-muted-foreground">No documents uploaded</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Student Documents */}
          <div>
            <p className="text-sm font-medium mb-2">Student Documents</p>
            <div className="space-y-2">
              {values.student_document.filter(doc => doc.name && doc.url).map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                  <span className="text-sm">{getDocumentName(doc.name)}</span>
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Uploaded
                  </Badge>
                </div>
              ))}
              {values.student_document.filter(doc => doc.name && doc.url).length === 0 && (
                <p className="text-sm text-muted-foreground">No documents uploaded</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Summary */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Please review all the information carefully before submitting. You can go back to any section to make changes.
        </AlertDescription>
      </Alert>
    </div>
  );
}