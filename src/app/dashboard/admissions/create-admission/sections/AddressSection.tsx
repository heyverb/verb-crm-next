import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { CreateAdmissionSchema } from "@/appwrite/schema/admission.schema";
import ControlledInput from "@/components/controlled/ControlledInput";
import ControlledSelect from "@/components/common/ControlledSelect";
import { getCity, getState } from "@/lib/place.helper";
import { MapPin } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type FormData = z.infer<typeof CreateAdmissionSchema>;

interface AddressSectionProps {
  form: UseFormReturn<FormData>;
}

export function AddressSection({ form }: AddressSectionProps) {
  const selectedState = form.watch("state");

  return (
    <div className="space-y-6">
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertDescription>
          Please provide the complete residential address. This will be used for all official correspondence.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 sm:grid-cols-2">
        <ControlledInput<FormData, "flat_no">
          control={form.control}
          name="flat_no"
          label="Flat/House Number (Optional)"
          placeholder="e.g., 101, A-12"
        />

        <ControlledInput<FormData, "address_line1">
          control={form.control}
          name="address_line1"
          label="Address Line 1"
          placeholder="Street address, building name"
        />

        <div className="sm:col-span-2">
          <ControlledInput<FormData, "address_line2">
            control={form.control}
            name="address_line2"
            label="Address Line 2 (Optional)"
            placeholder="Landmark, area, or additional details"
          />
        </div>

        <ControlledInput<FormData, "pincode">
          control={form.control}
          name="pincode"
          label="PIN Code"
          placeholder="e.g., 400001"
          maxLength={6}
        />

        <ControlledSelect<FormData, "state">
          control={form.control}
          name="state"
          label="State"
          placeholder="Select state"
          options={getState()}
        />

        <ControlledSelect<FormData, "city">
          control={form.control}
          name="city"
          label="City"
          placeholder={selectedState ? "Select city" : "Select state first"}
          options={getCity(selectedState)}
          disabled={!selectedState}
        />
      </div>
    </div>
  );
}