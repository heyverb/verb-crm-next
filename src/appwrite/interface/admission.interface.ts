export interface CreateAdmissionDto {
  /**
   *
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  fname: string;
  /**
   *
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  lname: string;
  /**
   *
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  dob: string;
  /**
   *
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  gender: GenderEnum;
  /**
   *
   * @type {string}
   * @memberof
   */
  cast: CastEnum;
  /**
   *
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  religion: ReligionEnum;
  /**
   *
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  bloodgroup: BloodgroupEnum;
  /**
   *
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  guardian_name: string;
  /**
   *
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  guardian_phone: string;
  /**
   *
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  guardian_email: string;
  /**
   *
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  plot_building_name: string;
  /**
   *
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  flat_no?: string;
  /**
   *
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  address_line1: string;
  /**
   *
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  address_line2?: string;
  /**
   *
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  pincode: string;
  /**
   *
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  state: string;
  /**
   *
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  city: string;
  /**
   *
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  status: StatusEnum;
  /**
   *
   * @type {Array<StudentDocument>}
   * @memberof CreateAdmissionDto
   */
  student_document: Array<StudentDocument>;
  /**
   *
   * @type {Array<GuardianDocument>}
   * @memberof CreateAdmissionDto
   */
  guardian_document: Array<GuardianDocument>;
  /**
   * Either a MongoDB ID or a populated class section object
   * @type {CreateClassDto}
   * @memberof CreateAdmissionDto
   */
  class_section: CreateClassDto;
  /**
   * school id
   * @type {string}
   * @memberof CreateAdmissionDto
   */
  school?: string;
}

export enum CastEnum {
  Brahmin = "Brahmin",
  Kshatriya = "Kshatriya",
  Vaishya = "Vaishya",
  Shudra = "Shudra",
  ScheduledCasteSc = "Scheduled Caste (SC)",
  ScheduledTribeSt = "Scheduled Tribe (ST)",
  OtherBackwardClassObc = "Other Backward Class (OBC)",
  General = "General",
  Other = "Other",
}

export enum ReligionEnum {
  Hinduism = "Hinduism",
  Islam = "Islam",
  Christianity = "Christianity",
  Sikhism = "Sikhism",
  Buddhism = "Buddhism",
  Jainism = "Jainism",
  Zoroastrianism = "Zoroastrianism",
  Judaism = "Judaism",
  Bah = "Bahá'í",
  Other = "Other",
}

export enum BloodgroupEnum {
  A = "A+",
  A2 = "A-",
  B = "B+",
  B2 = "B-",
  O = "O+",
  O2 = "O-",
  Ab = "AB+",
  Ab2 = "AB-",
}

export enum StatusEnum {
  Submitted = "SUBMITTED",
  Pending = "PENDING",
  Accepted = "ACCEPTED",
  Rejected = "REJECTED",
}

export interface StudentDocument {
  /**
   *
   * @type {string}
   * @memberof StudentDocument
   */
  type: StudentDocumentTypeEnum;
  /**
   *
   * @type {string}
   * @memberof StudentDocument
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof StudentDocument
   */
  url: string;
}

/**
 * @export
 * @enum {string}
 */
export enum StudentDocumentTypeEnum {
  BirthCertificate = "BIRTH_CERTIFICATE",
  AadharCard = "AADHAR_CARD",
  TransferCertificate = "TRANSFER_CERTIFICATE",
  LastMarksheet = "LAST_MARKSHEET",
  Photos = "PHOTOS",
  DomicileCertificate = "DOMICILE_CERTIFICATE",
  CasteCertificate = "CASTE_CERTIFICATE",
  IncomeCertificate = "INCOME_CERTIFICATE",
  MedicalCertificate = "MEDICAL_CERTIFICATE",
  VaccinationRecord = "VACCINATION_RECORD",
  ParentsIdProof = "PARENTS_ID_PROOF",
  AddressProof = "ADDRESS_PROOF",
  StudentPassport = "STUDENT_PASSPORT",
  MigrationCertificate = "MIGRATION_CERTIFICATE",
  ExtracurricularCertificates = "EXTRACURRICULAR_CERTIFICATES",
  SpecialNeedsCertificate = "SPECIAL_NEEDS_CERTIFICATE",
}

export interface GuardianDocument {
  /**
   *
   * @type {string}
   * @memberof GuardianDocument
   */
  type: GuardianDocumentTypeEnum;
  /**
   *
   * @type {string}
   * @memberof GuardianDocument
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof GuardianDocument
   */
  url: string;
}

export enum GuardianDocumentTypeEnum {
  AadharCard = "AADHAR_CARD",
  PanCard = "PAN_CARD",
  PassPort = "PASSPORT",
  Photos = "PHOTOS",
  DomicileCertificate = "DOMICILE_CERTIFICATE",
  CasteCertificate = "CASTE_CERTIFICATE",
  IncomeCertificate = "INCOME_CERTIFICATE",
}

export enum GenderEnum {
  Male = "MALE",
  Female = "FEMALE",
  Other = "OTHER",
}

export interface CreateClassDto {
  /**
   *
   * @type {string}
   * @memberof CreateClassDto
   */
  class_name: string;
  /**
   *
   * @type {string}
   * @memberof CreateClassDto
   */
  section_name: string;
  /**
   *
   * @type {string}
   * @memberof CreateClassDto
   */
  capacity: string;
  /**
   *
   * @type {number}
   * @memberof CreateClassDto
   */
  enrolled?: number;
  /**
   *
   * @type {string}
   * @memberof CreateClassDto
   */
  room_number?: string;
  /**
   *
   * @type {string}
   * @memberof CreateClassDto
   */
  floor?: string;
  /**
   *
   * @type {string}
   * @memberof CreateClassDto
   */
  status: CreateClassDtoStatusEnum;
  /**
   * school id
   * @type {string}
   * @memberof CreateClassDto
   */
  school?: string;
}

export enum CreateClassDtoStatusEnum {
  Submitted = "SUBMITTED",
  UnderReview = "UNDER_REVIEW",
  Accepted = "ACCEPTED",
  Rejected = "REJECTED",
}
