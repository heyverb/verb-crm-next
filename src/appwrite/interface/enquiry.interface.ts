export interface CreateEnquiryDto {
  /**
   * Student first name
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  student_fname: string;
  
  /**
   * Student last name
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  student_lname: string;
  
  /**
   * Student date of birth
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  student_dob: string;
  
  /**
   * Student gender
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  student_gender: EnquiryGenderEnum;
  
  /**
   * Class interested in
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  interested_class: string;
  
  /**
   * Previous school name
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  previous_school?: string;
  
  /**
   * Guardian name
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  guardian_name: string;
  
  /**
   * Guardian relation
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  guardian_relation: GuardianRelationEnum;
  
  /**
   * Guardian phone
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  guardian_phone: string;
  
  /**
   * Guardian email
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  guardian_email: string;
  
  /**
   * Guardian occupation
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  guardian_occupation?: string;
  
  /**
   * Address
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  address: string;
  
  /**
   * City
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  city: string;
  
  /**
   * State
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  state: string;
  
  /**
   * Pincode
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  pincode: string;
  
  /**
   * How did you hear about us
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  source: EnquirySourceEnum;
  
  /**
   * Additional message or notes
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  message?: string;
  
  /**
   * Enquiry status
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  status: EnquiryStatusEnum;
  
  /**
   * Priority level
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  priority: EnquiryPriorityEnum;
  
  /**
   * Follow up date
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  follow_up_date?: string;
  
  /**
   * Assigned to (staff member ID)
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  assigned_to?: string;
  
  /**
   * Internal notes (staff only)
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  internal_notes?: string;
  
  /**
   * Preferred contact time
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  preferred_contact_time?: string;
  
  /**
   * School ID
   * @type {string}
   * @memberof CreateEnquiryDto
   */
  school?: string;
}

export enum EnquiryGenderEnum {
  Male = "MALE",
  Female = "FEMALE",
  Other = "OTHER",
}

export enum GuardianRelationEnum {
  Father = "FATHER",
  Mother = "MOTHER",
  Guardian = "GUARDIAN",
  GrandParent = "GRANDPARENT",
  Other = "OTHER",
}

export enum EnquirySourceEnum {
  Website = "WEBSITE",
  WalkIn = "WALK_IN",
  PhoneCall = "PHONE_CALL",
  Referral = "REFERRAL",
  Advertisement = "ADVERTISEMENT",
  SocialMedia = "SOCIAL_MEDIA",
  Other = "OTHER",
}

export enum EnquiryStatusEnum {
  New = "NEW",
  Contacted = "CONTACTED",
  FollowUp = "FOLLOW_UP",
  Interested = "INTERESTED",
  NotInterested = "NOT_INTERESTED",
  Converted = "CONVERTED",
  Closed = "CLOSED",
}

export enum EnquiryPriorityEnum {
  Low = "LOW",
  Medium = "MEDIUM",
  High = "HIGH",
  Urgent = "URGENT",
}

export interface EnquiryFollowUp {
  /**
   * Follow up date
   * @type {string}
   * @memberof EnquiryFollowUp
   */
  date: string;
  
  /**
   * Follow up notes
   * @type {string}
   * @memberof EnquiryFollowUp
   */
  notes: string;
  
  /**
   * Follow up by (staff member name)
   * @type {string}
   * @memberof EnquiryFollowUp
   */
  by: string;
  
  /**
   * Next action
   * @type {string}
   * @memberof EnquiryFollowUp
   */
  next_action?: string;
  
  /**
   * Created at
   * @type {string}
   * @memberof EnquiryFollowUp
   */
  created_at: string;
}

export interface UpdateEnquiryDto extends Partial<CreateEnquiryDto> {
  /**
   * Document ID
   * @type {string}
   * @memberof UpdateEnquiryDto
   */
  $id?: string;
  
  /**
   * Follow up history
   * @type {Array<EnquiryFollowUp>}
   * @memberof UpdateEnquiryDto
   */
  follow_ups?: Array<EnquiryFollowUp>;
}