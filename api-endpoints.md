# API Endpoints Checklist

## Users Router

| Done | Endpoint          | Description                         | Method   | Input                                            | Access  |
| ---- | ----------------- | ----------------------------------- | -------- | ------------------------------------------------ | ------- |
| [x]  | emailExist        | Check if an email exists            | mutation | { email: string }                                | public  |
| [x]  | checkAuthProvider | Check email authentication provider | mutation | { email: string }                                | public  |
| [x]  | single            | Get user by ID                      | query    | -                                                | private |
| [x]  | list              | Get user list                       | query    | -                                                | private |
| [x]  | update            | Update user                         | mutation | { userId: string, updateUser: userUpdateSchema } | private |

## Roles Router

| Done | Endpoint | Description | Method   | Input            | Access |
| ---- | -------- | ----------- | -------- | ---------------- | ------ |
| [ ]  | create   | Create role | mutation | insertRoleSchema | public |
| [ ]  | list     | List roles  | query    | -                | public |

## Assignments Router

| Done | Endpoint | Description                 | Method   | Input                                                              | Access  |
| ---- | -------- | --------------------------- | -------- | ------------------------------------------------------------------ | ------- |
| [ ]  | create   | Create assignment           | mutation | insertAssignmentSchema                                             | private |
| [ ]  | list     | Get all assignments         | query    | -                                                                  | public  |
| [ ]  | single   | Get assignment by ID        | query    | { assignmentId: string }                                           | public  |
| [ ]  | byClass  | Get assignments by class ID | query    | { classId: string }                                                | public  |
| [ ]  | update   | Update assignment           | mutation | { assignmentId: string, updateAssignment: updateAssignmentSchema } | private |
| [ ]  | delete   | Delete assignment           | mutation | { assignmentId: string }                                           | private |

## Classes Router

| Done | Endpoint | Description            | Method   | Input                         | Access  |
| ---- | -------- | ---------------------- | -------- | ----------------------------- | ------- |
| [ ]  | create   | Create class           | mutation | insertClassSchema             | private |
| [ ]  | list     | Get all classes        | query    | -                             | public  |
| [ ]  | byUserId | Get classes by user ID | query    | { userId: string (optional) } | private |
| [ ]  | single   | Get class by ID        | query    | { classId: string }           | public  |

## Calendars Router

| Done | Endpoint | Description                     | Method   | Input                                                        | Access  |
| ---- | -------- | ------------------------------- | -------- | ------------------------------------------------------------ | ------- |
| [ ]  | create   | Create calendar event           | mutation | insertCalendarSchema                                         | private |
| [ ]  | list     | Get all calendar events         | query    | -                                                            | private |
| [ ]  | single   | Get calendar event by ID        | query    | { calendarId: string }                                       | public  |
| [ ]  | byClass  | Get calendar events by class ID | query    | { classId: string }                                          | public  |
| [ ]  | update   | Update calendar event           | mutation | { calendarId: string, updateCalendar: updateCalendarSchema } | private |

## Class Schedules Router

| Done | Endpoint | Description               | Method   | Input                                                             | Access  |
| ---- | -------- | ------------------------- | -------- | ----------------------------------------------------------------- | ------- |
| [ ]  | create   | Create class schedule     | mutation | insertClassScheduleSchema.omit({ id: true })                      | private |
| [ ]  | list     | Get all class schedules   | query    | -                                                                 | private |
| [ ]  | byClass  | Get schedules by class ID | query    | { classId: string }                                               | public  |
| [ ]  | update   | Update class schedule     | mutation | { scheduleId: string, updateSchedule: updateClassScheduleSchema } | private |
| [ ]  | delete   | Delete class schedule     | mutation | { scheduleId: string }                                            | private |

## Class Participants Router

| Done | Endpoint      | Description                  | Method | Input                                                    | Access  |
| ---- | ------------- | ---------------------------- | ------ | -------------------------------------------------------- | ------- |
| [ ]  | listByClassId | Get participants by class ID | query  | { classId: string, limit: number (optional, default=5) } | private |

## Language Classes Router

| Done | Endpoint  | Description                                 | Method   | Input                                                                         | Access  |
| ---- | --------- | ------------------------------------------- | -------- | ----------------------------------------------------------------------------- | ------- |
| [ ]  | create    | Create language class                       | mutation | createLanguageClassesSchema                                                   | private |
| [ ]  | list      | Get all language classes with language info | query    | -                                                                             | public  |
| [ ]  | myClasses | Get user's language classes                 | query    | -                                                                             | private |
| [ ]  | single    | Get language class by ID                    | query    | { languageClassId: string }                                                   | public  |
| [ ]  | update    | Update language class                       | mutation | { languageClassId: string, updateLanguageClass: updateLanguageClassesSchema } | private |

## Languages Router

| Done | Endpoint   | Description          | Method   | Input                                                        | Access  |
| ---- | ---------- | -------------------- | -------- | ------------------------------------------------------------ | ------- |
| [ ]  | create     | Create language      | mutation | createLanguageSchema                                         | private |
| [ ]  | list       | Get all languages    | query    | -                                                            | public  |
| [ ]  | single     | Get language by ID   | query    | { languageId: string }                                       | public  |
| [ ]  | update     | Update language      | mutation | { languageId: string, updateLanguage: updateLanguageSchema } | private |
| [ ]  | softDelete | Soft delete language | mutation | { languageId: string }                                       | private |
| [ ]  | delete     | Hard delete language | mutation | { languageId: string }                                       | private |

## Education Levels Router

| Done | Endpoint | Description               | Method   | Input                                                            | Access  |
| ---- | -------- | ------------------------- | -------- | ---------------------------------------------------------------- | ------- |
| [ ]  | create   | Create education level    | mutation | insertEducationLevelSchema                                       | public  |
| [ ]  | list     | Get all education levels  | query    | -                                                                | public  |
| [ ]  | single   | Get education level by ID | query    | { educationId: string }                                          | public  |
| [ ]  | update   | Update education level    | mutation | { educationId: string, updateLevel: updateEducationLevelSchema } | public  |
| [ ]  | delete   | Delete education level    | mutation | { educationId: string }                                          | private |

## Profile Agencies Router

| Done | Endpoint | Description               | Method   | Input                                                    | Access  |
| ---- | -------- | ------------------------- | -------- | -------------------------------------------------------- | ------- |
| [ ]  | create   | Create profile agency     | mutation | insertProfileAgencySchema                                | private |
| [ ]  | single   | Get single profile agency | query    | -                                                        | private |
| [ ]  | update   | Update profile agency     | mutation | { id: string, updateProfile: updateProfileAgencySchema } | private |

## Profile Participants Router

| Done | Endpoint | Description                    | Method   | Input                                                         | Access  |
| ---- | -------- | ------------------------------ | -------- | ------------------------------------------------------------- | ------- |
| [ ]  | create   | Create profile participant     | mutation | insertProfileParticipantSchema                                | private |
| [ ]  | single   | Get single profile participant | query    | -                                                             | private |
| [ ]  | update   | Update profile participant     | mutation | { id: string, updateProfile: updateProfileParticipantSchema } | private |

## Region Router

| Done | Endpoint  | Description                  | Method | Input                  | Access |
| ---- | --------- | ---------------------------- | ------ | ---------------------- | ------ |
| [ ]  | provinces | Get all provinces            | query  | -                      | public |
| [ ]  | regencies | Get regencies by province ID | query  | { provinceId: string } | public |
| [ ]  | districts | Get districts by regency ID  | query  | { regencyId: string }  | public |
| [ ]  | villages  | Get villages by district ID  | query  | { districtId: string } | public |
