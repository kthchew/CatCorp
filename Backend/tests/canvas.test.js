import * as canvas from '../canvas.js'
import axios from 'axios';
import { describe, it, expect, jest } from '@jest/globals';

jest.mock('axios')
axios.get = jest.fn()

describe('Canvas file', () => {
  // FIXME: can we filter out inactive courses that are marked incorrectly? If we fix this, remove `failing`
  it.failing('filters inactive courses out', async () => {
    const mockCourses = [
      {
        "id": 471036,
        "name": "AEB3671-Compar World Agric Spg23",
        "account_id": 8664,
        "uuid": "cFcJdKuc2JxMIyouecZhdowOlQwIdHaRQOWXV0Zc",
        "start_at": "2023-01-08T23:00:00Z",
        "grading_standard_id": 720847,
        "is_public": false,
        "created_at": "2022-11-29T19:15:26Z",
        "course_code": "AEB3671",
        "default_view": "wiki",
        "root_account_id": 2010,
        "enrollment_term_id": 2086,
        "license": "private",
        "grade_passback_setting": null,
        "end_at": null,
        "public_syllabus": false,
        "public_syllabus_to_auth": false,
        "storage_quota_mb": 3000,
        "is_public_to_auth_users": false,
        "homeroom_course": false,
        "course_color": null,
        "friendly_name": null,
        "apply_assignment_group_weights": true,
        "calendar": {
          "ics": "https://ufl.instructure.com/feeds/calendars/course_cFcJdKuc2JxMIyouecZhdowOlQwIdHaRQOWXV0Zc.ics"
        },
        "time_zone": "America/New_York",
        "blueprint": false,
        "template": false,
        "enrollments": [
          {
            "type": "student",
            "role": "StudentEnrollment",
            "role_id": 2884,
            "user_id": 1203025,
            "enrollment_state": "active",
            "limit_privileges_to_course_section": false
          }
        ],
        "hide_final_grades": false,
        "workflow_state": "available",
        "restrict_enrollments_to_course_dates": false
      },
      {
        "id": 498183,
        "name": "COP4600 - Operating Systems - Campus",
        "account_id": 8618,
        "uuid": "MCea103Xf54rXu5D6K8QEx5pjBqUA5c0qvNBWzwO",
        "start_at": null,
        "grading_standard_id": 728627,
        "is_public": true,
        "created_at": "2023-11-27T20:25:13Z",
        "course_code": "COP4600",
        "default_view": "wiki",
        "root_account_id": 2010,
        "enrollment_term_id": 2091,
        "license": "private",
        "grade_passback_setting": null,
        "end_at": null,
        "public_syllabus": true,
        "public_syllabus_to_auth": false,
        "storage_quota_mb": 3000,
        "is_public_to_auth_users": false,
        "homeroom_course": false,
        "course_color": null,
        "friendly_name": null,
        "apply_assignment_group_weights": true,
        "calendar": {
          "ics": "https://ufl.instructure.com/feeds/calendars/course_MCea103Xf54rXu5D6K8QEx5pjBqUA5c0qvNBWzwO.ics"
        },
        "time_zone": "America/New_York",
        "blueprint": false,
        "template": false,
        "enrollments": [
          {
            "type": "student",
            "role": "StudentEnrollment",
            "role_id": 2884,
            "user_id": 1203025,
            "enrollment_state": "active",
            "limit_privileges_to_course_section": false
          }
        ],
        "hide_final_grades": false,
        "workflow_state": "available",
        "restrict_enrollments_to_course_dates": false
      },
      {
        "id": 473496,
        "access_restricted_by_date": true
      },
      {
        "id": 502855,
        "name": "ENC3246-303E(25199) - Prof Comm Engineers",
        "account_id": 2010,
        "uuid": "WacdP2kbVlQjHGsdbsujRNW0r5RJXpBZMA5V0lrh",
        "start_at": null,
        "grading_standard_id": 0,
        "is_public": false,
        "created_at": "2024-01-03T17:22:17Z",
        "course_code": "ENC3246",
        "default_view": "wiki",
        "root_account_id": 2010,
        "enrollment_term_id": 2091,
        "license": "private",
        "grade_passback_setting": null,
        "end_at": null,
        "public_syllabus": false,
        "public_syllabus_to_auth": false,
        "storage_quota_mb": 3000,
        "is_public_to_auth_users": false,
        "homeroom_course": false,
        "course_color": null,
        "friendly_name": null,
        "apply_assignment_group_weights": false,
        "locale": "en",
        "calendar": {
          "ics": "https://ufl.instructure.com/feeds/calendars/course_WacdP2kbVlQjHGsdbsujRNW0r5RJXpBZMA5V0lrh.ics"
        },
        "time_zone": "America/New_York",
        "blueprint": false,
        "template": false,
        "enrollments": [
          {
            "type": "student",
            "role": "StudentEnrollment",
            "role_id": 2884,
            "user_id": 1203025,
            "enrollment_state": "active",
            "limit_privileges_to_course_section": false
          }
        ],
        "hide_final_grades": false,
        "workflow_state": "available",
        "restrict_enrollments_to_course_dates": false
      },
      {
        "id": 463210,
        "name": "First Year Engineering Advising 2022",
        "account_id": 8612,
        "uuid": "u4qmQ5E2urV2g8gHgZWegZEDhtmPezGeFvQvxYvs",
        "start_at": null,
        "grading_standard_id": null,
        "is_public": false,
        "created_at": "2022-08-10T13:15:39Z",
        "course_code": "First Year Engineering Advising 2022",
        "default_view": "wiki",
        "root_account_id": 2010,
        "enrollment_term_id": 1563,
        "license": "private",
        "grade_passback_setting": null,
        "end_at": null,
        "public_syllabus": false,
        "public_syllabus_to_auth": false,
        "storage_quota_mb": 3000,
        "is_public_to_auth_users": false,
        "homeroom_course": false,
        "course_color": null,
        "friendly_name": null,
        "apply_assignment_group_weights": false,
        "calendar": {
          "ics": "https://ufl.instructure.com/feeds/calendars/course_u4qmQ5E2urV2g8gHgZWegZEDhtmPezGeFvQvxYvs.ics"
        },
        "time_zone": "America/New_York",
        "blueprint": false,
        "template": false,
        "enrollments": [
          {
            "type": "student",
            "role": "StudentEnrollment",
            "role_id": 2884,
            "user_id": 1203025,
            "enrollment_state": "active",
            "limit_privileges_to_course_section": false
          }
        ],
        "hide_final_grades": false,
        "workflow_state": "available",
        "restrict_enrollments_to_course_dates": false
      },
      {
        "id": 459160,
        "name": "IDH1700 - Honors Prodev",
        "account_id": 12273,
        "uuid": "eAfL04Mxauc7LDVRJlwtbMCL7EUjP9Bjt2XsZzN2",
        "start_at": "2022-08-22T12:00:00Z",
        "grading_standard_id": null,
        "is_public": false,
        "created_at": "2022-05-09T13:00:52Z",
        "course_code": "IDH1700",
        "default_view": "wiki",
        "root_account_id": 2010,
        "enrollment_term_id": 2085,
        "license": "private",
        "grade_passback_setting": null,
        "end_at": null,
        "public_syllabus": false,
        "public_syllabus_to_auth": false,
        "storage_quota_mb": 3000,
        "is_public_to_auth_users": false,
        "homeroom_course": false,
        "course_color": null,
        "friendly_name": null,
        "apply_assignment_group_weights": true,
        "calendar": {
          "ics": "https://ufl.instructure.com/feeds/calendars/course_eAfL04Mxauc7LDVRJlwtbMCL7EUjP9Bjt2XsZzN2.ics"
        },
        "time_zone": "America/New_York",
        "blueprint": false,
        "template": false,
        "enrollments": [
          {
            "type": "student",
            "role": "StudentEnrollment",
            "role_id": 2884,
            "user_id": 1203025,
            "enrollment_state": "active",
            "limit_privileges_to_course_section": false
          }
        ],
        "hide_final_grades": false,
        "workflow_state": "available",
        "restrict_enrollments_to_course_dates": true
      },
      {
        "id": 498017,
        "name": "IDH3931 - Digital Logic with Minecraft",
        "account_id": 12273,
        "uuid": "iH9ovkvPadTQflCokJUbflyV67nHPRdRCWZeYSeN",
        "start_at": null,
        "grading_standard_id": null,
        "is_public": null,
        "created_at": "2023-11-21T19:25:13Z",
        "course_code": "IDH3931",
        "default_view": "syllabus",
        "root_account_id": 2010,
        "enrollment_term_id": 2091,
        "license": null,
        "grade_passback_setting": null,
        "end_at": null,
        "public_syllabus": false,
        "public_syllabus_to_auth": false,
        "storage_quota_mb": 3000,
        "is_public_to_auth_users": false,
        "homeroom_course": false,
        "course_color": null,
        "friendly_name": null,
        "apply_assignment_group_weights": false,
        "calendar": {
          "ics": "https://ufl.instructure.com/feeds/calendars/course_iH9ovkvPadTQflCokJUbflyV67nHPRdRCWZeYSeN.ics"
        },
        "time_zone": "America/New_York",
        "blueprint": false,
        "template": false,
        "enrollments": [
          {
            "type": "student",
            "role": "StudentEnrollment",
            "role_id": 2884,
            "user_id": 1203025,
            "enrollment_state": "active",
            "limit_privileges_to_course_section": false
          }
        ],
        "hide_final_grades": false,
        "workflow_state": "available",
        "restrict_enrollments_to_course_dates": false
      },
      {
        "id": 462198,
        "name": "IDH3931 - Exploring Artificial Intelligence in Modern Society",
        "account_id": 12273,
        "uuid": "Yg2s0CfBvXJMBdTqx8rAUChpALiLneWMQ2UCuXaf",
        "start_at": null,
        "grading_standard_id": null,
        "is_public": null,
        "created_at": "2022-07-29T16:00:25Z",
        "course_code": "IDH3931",
        "default_view": "wiki",
        "root_account_id": 2010,
        "enrollment_term_id": 2085,
        "license": null,
        "grade_passback_setting": null,
        "end_at": null,
        "public_syllabus": false,
        "public_syllabus_to_auth": false,
        "storage_quota_mb": 3000,
        "is_public_to_auth_users": false,
        "homeroom_course": false,
        "course_color": null,
        "friendly_name": null,
        "apply_assignment_group_weights": true,
        "calendar": {
          "ics": "https://ufl.instructure.com/feeds/calendars/course_Yg2s0CfBvXJMBdTqx8rAUChpALiLneWMQ2UCuXaf.ics"
        },
        "time_zone": "America/New_York",
        "blueprint": false,
        "template": false,
        "enrollments": [
          {
            "type": "student",
            "role": "StudentEnrollment",
            "role_id": 2884,
            "user_id": 1203025,
            "enrollment_state": "active",
            "limit_privileges_to_course_section": false
          }
        ],
        "hide_final_grades": false,
        "workflow_state": "available",
        "restrict_enrollments_to_course_dates": false
      },
      {
        "id": 471112,
        "name": "IDS1161 Nichols",
        "account_id": 12454,
        "uuid": "EFhWMS80muvwB37fWaJbaXhcQgXLqq4wWvzDSrO2",
        "start_at": null,
        "grading_standard_id": 719357,
        "is_public": false,
        "created_at": "2022-11-29T21:50:19Z",
        "course_code": "IDS1161",
        "default_view": "wiki",
        "root_account_id": 2010,
        "enrollment_term_id": 2086,
        "license": "private",
        "grade_passback_setting": null,
        "end_at": null,
        "public_syllabus": true,
        "public_syllabus_to_auth": false,
        "storage_quota_mb": 3000,
        "is_public_to_auth_users": false,
        "homeroom_course": false,
        "course_color": null,
        "friendly_name": null,
        "apply_assignment_group_weights": false,
        "calendar": {
          "ics": "https://ufl.instructure.com/feeds/calendars/course_EFhWMS80muvwB37fWaJbaXhcQgXLqq4wWvzDSrO2.ics"
        },
        "time_zone": "America/New_York",
        "blueprint": false,
        "template": false,
        "enrollments": [
          {
            "type": "student",
            "role": "StudentEnrollment",
            "role_id": 2884,
            "user_id": 1203025,
            "enrollment_state": "active",
            "limit_privileges_to_course_section": false
          }
        ],
        "hide_final_grades": false,
        "workflow_state": "available",
        "restrict_enrollments_to_course_dates": false
      }
    ]
    const activeCourses = [
      {
        "id": 498183,
        "name": "COP4600 - Operating Systems - Campus",
        "account_id": 8618,
        "uuid": "MCea103Xf54rXu5D6K8QEx5pjBqUA5c0qvNBWzwO",
        "start_at": null,
        "grading_standard_id": 728627,
        "is_public": true,
        "created_at": "2023-11-27T20:25:13Z",
        "course_code": "COP4600",
        "default_view": "wiki",
        "root_account_id": 2010,
        "enrollment_term_id": 2091,
        "license": "private",
        "grade_passback_setting": null,
        "end_at": null,
        "public_syllabus": true,
        "public_syllabus_to_auth": false,
        "storage_quota_mb": 3000,
        "is_public_to_auth_users": false,
        "homeroom_course": false,
        "course_color": null,
        "friendly_name": null,
        "apply_assignment_group_weights": true,
        "calendar": {
          "ics": "https://ufl.instructure.com/feeds/calendars/course_MCea103Xf54rXu5D6K8QEx5pjBqUA5c0qvNBWzwO.ics"
        },
        "time_zone": "America/New_York",
        "blueprint": false,
        "template": false,
        "enrollments": [
          {
            "type": "student",
            "role": "StudentEnrollment",
            "role_id": 2884,
            "user_id": 1203025,
            "enrollment_state": "active",
            "limit_privileges_to_course_section": false
          }
        ],
        "hide_final_grades": false,
        "workflow_state": "available",
        "restrict_enrollments_to_course_dates": false
      },
      {
        "id": 502855,
        "name": "ENC3246-303E(25199) - Prof Comm Engineers",
        "account_id": 2010,
        "uuid": "WacdP2kbVlQjHGsdbsujRNW0r5RJXpBZMA5V0lrh",
        "start_at": null,
        "grading_standard_id": 0,
        "is_public": false,
        "created_at": "2024-01-03T17:22:17Z",
        "course_code": "ENC3246",
        "default_view": "wiki",
        "root_account_id": 2010,
        "enrollment_term_id": 2091,
        "license": "private",
        "grade_passback_setting": null,
        "end_at": null,
        "public_syllabus": false,
        "public_syllabus_to_auth": false,
        "storage_quota_mb": 3000,
        "is_public_to_auth_users": false,
        "homeroom_course": false,
        "course_color": null,
        "friendly_name": null,
        "apply_assignment_group_weights": false,
        "locale": "en",
        "calendar": {
          "ics": "https://ufl.instructure.com/feeds/calendars/course_WacdP2kbVlQjHGsdbsujRNW0r5RJXpBZMA5V0lrh.ics"
        },
        "time_zone": "America/New_York",
        "blueprint": false,
        "template": false,
        "enrollments": [
          {
            "type": "student",
            "role": "StudentEnrollment",
            "role_id": 2884,
            "user_id": 1203025,
            "enrollment_state": "active",
            "limit_privileges_to_course_section": false
          }
        ],
        "hide_final_grades": false,
        "workflow_state": "available",
        "restrict_enrollments_to_course_dates": false
      },
      {
        "id": 498017,
        "name": "IDH3931 - Digital Logic with Minecraft",
        "account_id": 12273,
        "uuid": "iH9ovkvPadTQflCokJUbflyV67nHPRdRCWZeYSeN",
        "start_at": null,
        "grading_standard_id": null,
        "is_public": null,
        "created_at": "2023-11-21T19:25:13Z",
        "course_code": "IDH3931",
        "default_view": "syllabus",
        "root_account_id": 2010,
        "enrollment_term_id": 2091,
        "license": null,
        "grade_passback_setting": null,
        "end_at": null,
        "public_syllabus": false,
        "public_syllabus_to_auth": false,
        "storage_quota_mb": 3000,
        "is_public_to_auth_users": false,
        "homeroom_course": false,
        "course_color": null,
        "friendly_name": null,
        "apply_assignment_group_weights": false,
        "calendar": {
          "ics": "https://ufl.instructure.com/feeds/calendars/course_iH9ovkvPadTQflCokJUbflyV67nHPRdRCWZeYSeN.ics"
        },
        "time_zone": "America/New_York",
        "blueprint": false,
        "template": false,
        "enrollments": [
          {
            "type": "student",
            "role": "StudentEnrollment",
            "role_id": 2884,
            "user_id": 1203025,
            "enrollment_state": "active",
            "limit_privileges_to_course_section": false
          }
        ],
        "hide_final_grades": false,
        "workflow_state": "available",
        "restrict_enrollments_to_course_dates": false
      }
    ]

    axios.get.mockResolvedValue({ data: mockCourses })
    const result = await canvas.getCourses("token")
    expect(result).toEqual(activeCourses)
  })

  it('transforms only assignments due in future', async () => {
    const mockAssignments = [
      {
        "id": 6015471,
        "description": "<div id=\"kl_wrapper_3\" class=\"kl_basic_color kl_wrapper\" style=\"margin-bottom: 15px; margin-top: 25px;\">\n<div id=\"kl_custom_block_90\" style=\"background-color: #2f2f41; color: #ffffff; padding-bottom: 8px; padding-top: 8px; border-bottom-width: 4px; border-bottom-style: solid; border-bottom-color: #81e5fc;\">\n<div class=\"kl_flex_columns_wrapper\" style=\"margin-right: 25px; margin-left: 25px;\">\n<div class=\"kl_flex_column\" style=\"flex: 0 0 auto; display: flex; margin-right: 25px;\">\n<h2 style=\"border-right-width: 5px; border-right-style: none; border-right-color: #6aeef0; margin: 9px 0px 0px; color: #ffffff;\"><strong><span style=\"font-size: 16pt; border-right-width: 5px; border-right-style: solid; border-right-color: #81e5fc; padding-top: 12px; padding-right: 25px; padding-bottom: 10px;\">Module 12</span></strong></h2>\n</div>\n<div id=\"kl_banner\" class=\"kl_flex_column\" style=\"margin-left: 0px; margin-right: 0px; color: #ffffff; background-color: #2f2f41;\">\n<h2 style=\"color: #ffffff;\"><span id=\"kl_banner_right\" style=\"font-size: 25pt; color: #ffffff; padding-left: 0px; line-height: initial;\">Sprint 1 Presentation</span></h2>\n</div>\n</div>\n</div>\n<div id=\"kl_banner_image\" style=\"margin-top: 0px; margin-bottom: 0px;\"><img id=\"69488212\" class=\"kl_image_full_width\" role=\"presentation\" src=\"https://ufl.instructure.com/courses/505767/files/84478029/download?verifier=IPdrfOct9daehDrbJqIs8fKPiHkUDaQWYS9pjmPW\" alt=\"\" data-api-endpoint=\"https://ufl.instructure.com/api/v1/courses/505767/files/84478029\" data-api-returntype=\"File\"></div>\n<div id=\"kl_custom_block_1\" style=\"margin-top: 35px; padding-left: 15px; padding-right: 15px;\">\n<h3 style=\"border-bottom-width: 3px; border-bottom-style: solid; border-bottom-color: #81e5fc; padding-bottom: 0px; margin-bottom: 15px;\"><i class=\"fas fa-info-circle\" aria-hidden=\"true\"><span class=\"dp-icon-content\" style=\"display: none;\">&nbsp;</span></i><strong style=\"padding-bottom: 5px;\">Overview</strong></h3>\n<p>In this assignment, you will give a progress update to an audience of technical staff and senior developers.</p>\n</div>\n<div id=\"kl_custom_block_1\" style=\"margin-top: 35px; padding-left: 15px; padding-right: 15px;\">\n<h3 style=\"border-bottom-width: 3px; border-bottom-style: solid; border-bottom-color: #81e5fc; padding-bottom: 0px; margin-bottom: 15px;\"><i class=\"fas fa-bars\" aria-hidden=\"true\"><span class=\"dp-icon-content\" style=\"display: none;\">&nbsp;</span></i><strong style=\"padding-bottom: 5px;\">Instructions</strong></h3>\n<p>Your group's presentation should include:</p>\n<ul>\n<li>A project update.</li>\n<li>Review some of your software tests.</li>\n<li>Technical progress.</li>\n<li>A functionality demonstration.</li>\n</ul>\n<p>Your presentation should also:</p>\n<ul>\n<li>Explain your Sprint 1 backlog accomplishments.</li>\n<li>Show your Kanban board.</li>\n<li>Review sprint 2 backlog with estimations.&nbsp;</li>\n</ul>\n<p>It is also important that you:</p>\n<ul>\n<li>Include a proper introduction with team member roles and responsibilities.</li>\n<li>End with a report of issues and next steps.&nbsp;</li>\n</ul>\n</div>\n<div id=\"kl_custom_block_1\" style=\"margin-top: 35px; padding-left: 15px; padding-right: 15px;\">\n<h3 style=\"border-bottom-width: 3px; border-bottom-style: solid; border-bottom-color: #81e5fc; padding-bottom: 0px; margin-bottom: 15px;\"><i class=\"fas fa-check-circle\" aria-hidden=\"true\"><span class=\"dp-icon-content\" style=\"display: none;\">&nbsp;</span></i><strong style=\"padding-bottom: 5px;\">Guidelines and Submissions</strong></h3>\n<ul>\n<li>Your presentation must be 15 minutes <strong>maximum</strong>.</li>\n<li>Each team member must speak during the presentation.&nbsp;</li>\n<li>All team member cameras must be on the entire presentation.&nbsp;</li>\n<li>This assignment is worth 55 points.</li>\n<li>Submit a PDF of your presentation slides through the file upload.&nbsp;</li>\n<li>Submit the recording of your presentation via a YouTube link by adding a comment with the link to your file upload.</li>\n<li>Please see the rubric below for details on how you will be assessed.</li>\n</ul>\n</div>\n<div id=\"kl_custom_block_shared_1\" style=\"padding: 5px 10px 2px; background-color: #2f2f41; color: #ffffff; border-top-width: 4px; border-top-style: none; border-top-color: #81e5fc; border-bottom-width: 4px; border-bottom-style: solid; border-bottom-color: #81e5fc;\">\n<p style=\"margin-top: 3px; margin-bottom: 3px;\"><i class=\"fas fa-redo-alt\" style=\"color: #ffffff;\" aria-hidden=\"true\"><span class=\"dp-icon-content\" style=\"display: none;\">&nbsp;</span></i> <strong><a style=\"color: #ffffff; text-decoration: none;\" href=\"https://ufl.instructure.com/courses/505767/modules/items/10873230\">Return to Module 11</a></strong></p>\n</div>\n</div>",
        "due_at": "2024-03-30T03:59:59Z",
        "unlock_at": "2024-03-19T21:15:00Z",
        "lock_at": "2024-04-03T03:59:59Z",
        "points_possible": 55,
        "grading_type": "points",
        "assignment_group_id": 927781,
        "grading_standard_id": null,
        "created_at": "2024-01-09T15:23:55Z",
        "updated_at": "2024-03-19T22:10:39Z",
        "peer_reviews": false,
        "automatic_peer_reviews": false,
        "position": 2,
        "grade_group_students_individually": false,
        "anonymous_peer_reviews": false,
        "group_category_id": 84263,
        "post_to_sis": false,
        "moderated_grading": false,
        "omit_from_final_grade": false,
        "intra_group_peer_reviews": false,
        "anonymous_instructor_annotations": false,
        "anonymous_grading": false,
        "graders_anonymous_to_graders": false,
        "grader_count": 0,
        "grader_comments_visible_to_graders": true,
        "final_grader_id": null,
        "grader_names_visible_to_final_grader": true,
        "allowed_attempts": -1,
        "annotatable_attachment_id": null,
        "hide_in_gradebook": false,
        "secure_params": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsdGlfYXNzaWdubWVudF9pZCI6ImVhODA4NTYwLWE3NDUtNGJlZS04YjFiLWQ2OGM4OWQ5NDY5YiIsImx0aV9hc3NpZ25tZW50X2Rlc2NyaXB0aW9uIjoiXHUwMDNjZGl2IGlkPVwia2xfd3JhcHBlcl8zXCIgY2xhc3M9XCJrbF9iYXNpY19jb2xvciBrbF93cmFwcGVyXCIgc3R5bGU9XCJtYXJnaW4tYm90dG9tOiAxNXB4OyBtYXJnaW4tdG9wOiAyNXB4O1wiXHUwMDNlXG5cdTAwM2NkaXYgaWQ9XCJrbF9jdXN0b21fYmxvY2tfOTBcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICMyZjJmNDE7IGNvbG9yOiAjZmZmZmZmOyBwYWRkaW5nLWJvdHRvbTogOHB4OyBwYWRkaW5nLXRvcDogOHB4OyBib3JkZXItYm90dG9tLXdpZHRoOiA0cHg7IGJvcmRlci1ib3R0b20tc3R5bGU6IHNvbGlkOyBib3JkZXItYm90dG9tLWNvbG9yOiAjODFlNWZjO1wiXHUwMDNlXG5cdTAwM2NkaXYgY2xhc3M9XCJrbF9mbGV4X2NvbHVtbnNfd3JhcHBlclwiIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAyNXB4OyBtYXJnaW4tbGVmdDogMjVweDtcIlx1MDAzZVxuXHUwMDNjZGl2IGNsYXNzPVwia2xfZmxleF9jb2x1bW5cIiBzdHlsZT1cImZsZXg6IDAgMCBhdXRvOyBkaXNwbGF5OiBmbGV4OyBtYXJnaW4tcmlnaHQ6IDI1cHg7XCJcdTAwM2Vcblx1MDAzY2gyIHN0eWxlPVwiYm9yZGVyLXJpZ2h0LXdpZHRoOiA1cHg7IGJvcmRlci1yaWdodC1zdHlsZTogbm9uZTsgYm9yZGVyLXJpZ2h0LWNvbG9yOiAjNmFlZWYwOyBtYXJnaW46IDlweCAwcHggMHB4OyBjb2xvcjogI2ZmZmZmZjtcIlx1MDAzZVx1MDAzY3N0cm9uZ1x1MDAzZVx1MDAzY3NwYW4gc3R5bGU9XCJmb250LXNpemU6IDE2cHQ7IGJvcmRlci1yaWdodC13aWR0aDogNXB4OyBib3JkZXItcmlnaHQtc3R5bGU6IHNvbGlkOyBib3JkZXItcmlnaHQtY29sb3I6ICM4MWU1ZmM7IHBhZGRpbmctdG9wOiAxMnB4OyBwYWRkaW5nLXJpZ2h0OiAyNXB4OyBwYWRkaW5nLWJvdHRvbTogMTBweDtcIlx1MDAzZU1vZHVsZSAxMlx1MDAzYy9zcGFuXHUwMDNlXHUwMDNjL3N0cm9uZ1x1MDAzZVx1MDAzYy9oMlx1MDAzZVxuXHUwMDNjL2Rpdlx1MDAzZVxuXHUwMDNjZGl2IGlkPVwia2xfYmFubmVyXCIgY2xhc3M9XCJrbF9mbGV4X2NvbHVtblwiIHN0eWxlPVwibWFyZ2luLWxlZnQ6IDBweDsgbWFyZ2luLXJpZ2h0OiAwcHg7IGNvbG9yOiAjZmZmZmZmOyBiYWNrZ3JvdW5kLWNvbG9yOiAjMmYyZjQxO1wiXHUwMDNlXG5cdTAwM2NoMiBzdHlsZT1cImNvbG9yOiAjZmZmLi4uICh0cnVuY2F0ZWQpIn0.M-eeQMJLQz9H-7EFeX7_MfxwgVFRCMYJAnFbR3TrnoM",
        "lti_context_id": "ea808560-a745-4bee-8b1b-d68c89d9469b",
        "course_id": 505767,
        "name": "Module 12: Sprint 1 Presentation",
        "submission_types": [
          "online_upload"
        ],
        "has_submitted_submissions": false,
        "due_date_required": false,
        "max_name_length": 255,
        "in_closed_grading_period": false,
        "graded_submissions_exist": false,
        "is_quiz_assignment": false,
        "can_duplicate": true,
        "original_course_id": null,
        "original_assignment_id": null,
        "original_lti_resource_link_id": null,
        "original_assignment_name": null,
        "original_quiz_id": null,
        "workflow_state": "published",
        "important_dates": false,
        "muted": true,
        "html_url": "https://ufl.instructure.com/courses/505767/assignments/6015471",
        "use_rubric_for_grading": true,
        "free_form_criterion_comments": false,
        "rubric": [
          {
            "id": "_93",
            "points": 15,
            "description": "Content",
            "long_description": "",
            "criterion_use_range": true,
            "ratings": [
              {
                "id": "blank",
                "points": 15,
                "description": "Proficient",
                "long_description": "Topic is tightly focused and relevant; presentation contains accurate information and appropriate for audience"
              },
              {
                "id": "394088_6377",
                "points": 14,
                "description": "Needs Improvement",
                "long_description": "Topic would benefit from more focus; presentation contains some errors or omissions. Not catered to specified audience."
              },
              {
                "id": "blank_2",
                "points": 11,
                "description": "Inadequate",
                "long_description": "Topic lacks relevance or focus; presentation contains multiple fact errors"
              }
            ]
          },
          {
            "id": "_2128",
            "points": 10,
            "description": "Organization and Clarity",
            "long_description": "",
            "criterion_use_range": true,
            "ratings": [
              {
                "id": "_1572",
                "points": 10,
                "description": "Proficient",
                "long_description": "Ideas are presented in logical order with effective transitions between major ideas; presentation is clear and concise"
              },
              {
                "id": "394088_2332",
                "points": 9,
                "description": "Needs Improvement",
                "long_description": "Some ideas not presented in proper order; transitions are needed between some ideas; some parts of presentation may be wordy or unclear"
              },
              {
                "id": "_9016",
                "points": 7,
                "description": "Inadequate",
                "long_description": "Ideas are not presented in proper order; transition are lacking between major ideas; several parts of presentation are wordy or unclear"
              }
            ]
          },
          {
            "id": "_1429",
            "points": 15,
            "description": "Completeness",
            "long_description": "",
            "criterion_use_range": true,
            "ratings": [
              {
                "id": "_2961",
                "points": 15,
                "description": "Proficient",
                "long_description": "Presentation provides good depth and detail; ideas well developed; facts have adequate background; presentation is within specified length"
              },
              {
                "id": "400156_4194",
                "points": 14,
                "description": "Needs Improvement",
                "long_description": "Additional depth needed in places; important information omitted or not fully developed; presentation is too short or too long"
              },
              {
                "id": "_8800",
                "points": 11,
                "description": "Inadequate",
                "long_description": "Presentation does not provide adequate depth; key details are omitted or undeveloped; presentation is too short or too long"
              }
            ]
          },
          {
            "id": "_5531",
            "points": 15,
            "description": "Delivery",
            "long_description": "",
            "criterion_use_range": true,
            "ratings": [
              {
                "id": "_5650",
                "points": 15,
                "description": "Proficient",
                "long_description": "Good volume and energy; proper pace and diction; avoidance of distracting gestures; professional appearance; visual aids used effectively"
              },
              {
                "id": "400156_314",
                "points": 14,
                "description": "Needs Improvement",
                "long_description": "More volume/energy needed at times; pace too slow or fast; some distracting gestures or posture; adequate appearance; visual aids could be improved"
              },
              {
                "id": "_364",
                "points": 11,
                "description": "Inadequate",
                "long_description": "Low volume or energy; pace too slow or fast; poor diction; distracting gestures or posture; unprofessional appearance; visual aids poorly used"
              }
            ]
          },
          {
            "id": "535698_7116",
            "points": 0,
            "description": "Extra Credit",
            "long_description": "",
            "criterion_use_range": false,
            "ratings": [
              {
                "id": "535698_5886",
                "points": 0,
                "description": "Full Marks",
                "long_description": ""
              },
              {
                "id": "535698_3737",
                "points": 0,
                "description": "No Marks",
                "long_description": ""
              }
            ]
          }
        ],
        "rubric_settings": {
          "id": 535698,
          "title": "Sprint 1 Presentation Rubric",
          "points_possible": 55,
          "free_form_criterion_comments": false,
          "hide_score_total": false,
          "hide_points": false
        },
        "published": true,
        "only_visible_to_overrides": false,
        "bucket": "unsubmitted",
        "locked_for_user": false,
        "submissions_download_url": "https://ufl.instructure.com/courses/505767/assignments/6015471/submissions?zip=1",
        "post_manually": true,
        "anonymize_students": false,
        "require_lockdown_browser": false,
        "restrict_quantitative_data": false
      },
      {
        "id": 6015465,
        "due_at": "2024-04-06T03:59:00Z",
        "unlock_at": "2024-03-23T01:00:00Z",
        "lock_at": "2024-04-10T03:59:00Z",
        "points_possible": 10,
        "grading_type": "points",
        "assignment_group_id": 927782,
        "grading_standard_id": null,
        "created_at": "2024-01-09T15:23:44Z",
        "updated_at": "2024-03-19T22:01:43Z",
        "peer_reviews": false,
        "automatic_peer_reviews": false,
        "position": 2,
        "grade_group_students_individually": false,
        "anonymous_peer_reviews": false,
        "group_category_id": null,
        "post_to_sis": false,
        "moderated_grading": false,
        "omit_from_final_grade": false,
        "intra_group_peer_reviews": false,
        "anonymous_instructor_annotations": false,
        "anonymous_grading": false,
        "graders_anonymous_to_graders": false,
        "grader_count": 0,
        "grader_comments_visible_to_graders": true,
        "final_grader_id": null,
        "grader_names_visible_to_final_grader": true,
        "allowed_attempts": -1,
        "annotatable_attachment_id": null,
        "hide_in_gradebook": false,
        "lock_info": {
          "unlock_at": "2024-03-23T01:00:00Z",
          "asset_string": "assignment_6015465"
        },
        "secure_params": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsdGlfYXNzaWdubWVudF9pZCI6ImNiZGQzNDQyLWE3MTEtNGIyMi04YTM5LTcxNTk4YzIwOTUyYiJ9.IyIa_5y0w4RtN16kM_pfsY5e2BPRA-NTuxFV5aSkKL0",
        "lti_context_id": "cbdd3442-a711-4b22-8a39-71598c20952b",
        "course_id": 505767,
        "name": "Module 12: Peer Evaluation 2",
        "submission_types": [
          "online_quiz"
        ],
        "has_submitted_submissions": false,
        "due_date_required": false,
        "max_name_length": 255,
        "in_closed_grading_period": false,
        "graded_submissions_exist": false,
        "is_quiz_assignment": false,
        "can_duplicate": false,
        "original_course_id": null,
        "original_assignment_id": null,
        "original_lti_resource_link_id": null,
        "original_assignment_name": null,
        "original_quiz_id": null,
        "workflow_state": "published",
        "important_dates": false,
        "description": null,
        "muted": true,
        "html_url": "https://ufl.instructure.com/courses/505767/assignments/6015465",
        "quiz_id": 1332914,
        "anonymous_submissions": false,
        "published": true,
        "only_visible_to_overrides": false,
        "bucket": "unsubmitted",
        "locked_for_user": true,
        "lock_explanation": "This assignment is locked until Mar 22 at 9pm.",
        "submissions_download_url": "https://ufl.instructure.com/courses/505767/quizzes/1332914/submissions?zip=1",
        "post_manually": true,
        "anonymize_students": false,
        "require_lockdown_browser": false,
        "restrict_quantitative_data": false
      },
      {
        "id": 6015489,
        "description": "<div id=\"kl_wrapper_3\" class=\"kl_basic_color kl_wrapper\" style=\"margin-bottom: 15px; margin-top: 25px;\">\n<div id=\"kl_custom_block_90\" style=\"background-color: #2f2f41; color: #ffffff; padding-bottom: 8px; padding-top: 8px; border-bottom: 4px solid #81e5fc;\">\n<div class=\"kl_flex_columns_wrapper\" style=\"margin-right: 25px; margin-left: 25px;\">\n<div class=\"kl_flex_column\" style=\"flex: 0 0 auto; display: flex; margin-right: 25px;\">\n<h2 style=\"border-right: 5px none #6aeef0; margin: 9px 0px 0px; color: #ffffff;\"><strong><span style=\"font-size: 16pt; border-right: 5px solid #81e5fc; padding-top: 12px; padding-right: 25px; padding-bottom: 10px;\">Module 4</span></strong></h2>\n</div>\n<div id=\"kl_banner\" class=\"kl_flex_column\" style=\"margin-left: 0px; margin-right: 0px; color: #ffffff; background-color: #2f2f41;\">\n<h2 style=\"color: #ffffff;\"><span id=\"kl_banner_right\" style=\"font-size: 25pt; color: #ffffff; padding-left: 0px; line-height: initial;\">Perusall Reading: Software Configuration Management Practices for eXtreme Programming Teams<br></span></h2>\n</div>\n</div>\n</div>\n<div id=\"kl_banner_image\" style=\"margin-top: 0px; margin-bottom: 0px;\"><img id=\"69488212\" class=\"kl_image_full_width\" role=\"presentation\" src=\"https://ufl.instructure.com/courses/505767/files/84478029/download?verifier=IPdrfOct9daehDrbJqIs8fKPiHkUDaQWYS9pjmPW\" alt=\"\" data-api-endpoint=\"https://ufl.instructure.com/api/v1/courses/505767/files/84478029\" data-api-returntype=\"File\"></div>\n<div id=\"kl_custom_block_1\" style=\"margin-top: 35px; padding-left: 15px; padding-right: 15px;\">\n<h3 style=\"border-bottom: 3px solid #81e5fc; padding-bottom: 0px; margin-bottom: 15px;\"><i class=\"fas fa-info-circle\" aria-hidden=\"true\"><span class=\"dp-icon-content\" style=\"display: none;\">&nbsp;</span></i><strong style=\"padding-bottom: 5px;\">Overview</strong></h3>\n<p>In this assignment, I want you to read and discuss an article that discusses software configuration management practices. Setting up the development environment puts your team in the best position to be successful. As a team you can employ some best practices around configuration management and code management to save time and avoid pitfalls in their codebase.&nbsp;</p>\n</div>\n<div id=\"kl_custom_block_1\" style=\"margin-top: 35px; padding-left: 15px; padding-right: 15px;\">\n<h3 style=\"border-bottom: 3px solid #81e5fc; padding-bottom: 0px; margin-bottom: 15px;\"><i class=\"fas fa-bars\" aria-hidden=\"true\"><span class=\"dp-icon-content\" style=\"display: none;\">&nbsp;</span></i><strong style=\"padding-bottom: 5px;\">Instructions</strong></h3>\n<p>Review the reading<a class=\"instructure_file_link instructure_scribd_file inline_disabled\" title=\"Software Configuration Management Practices for eXtreme Programming Teams.pdf\" href=\"https://ufl.instructure.com/courses/505767/files/85120087?verifier=UQ331hsQxcb8FnDmO9xYI4dqSd9Oj0a8LDzyy4D8&amp;wrap=1\" target=\"_blank\" data-canvas-previewable=\"false\" data-api-endpoint=\"https://ufl.instructure.com/api/v1/courses/505767/files/85120087\" data-api-returntype=\"File\"> <strong>here</strong></a></p>\n<p>We will have an in-class discussion and then enter the response to the following questions:</p>\n<ul>\n<li>The importance of software configuration management.</li>\n<li>The benefits of incorporating SCM sub practices.</li>\n<li>The risks of not setting up an SCM environment.</li>\n<li>What are some popular SCM tools to share with your peers?</li>\n</ul>\n</div>\n<div id=\"kl_custom_block_1\" style=\"margin-top: 35px; padding-left: 15px; padding-right: 15px;\"></div>\n<div id=\"kl_custom_block_1\" style=\"margin-top: 35px; padding-left: 15px; padding-right: 15px;\">\n<div class=\"kl_panels_wrapper kl_panels_tabs\" style=\"padding-top: 10px;\">\n<div id=\"kl_panel_1_content\" class=\"kl_panel_content kl_panel_1\">\n<div class=\"bs-container\">\n<p>Notes: you can enter short answers either points or a few sentences.</p>\n</div>\n</div>\n</div>\n</div>\n<div id=\"kl_custom_block_shared_1\" style=\"padding: 5px 10px 2px; background-color: #2f2f41; color: #ffffff; border-top: 4px none #81e5fc; border-bottom: 4px solid #81e5fc;\">\n<p style=\"margin-top: 3px; margin-bottom: 3px;\"><i class=\"fas fa-redo-alt\" style=\"color: #ffffff;\" aria-hidden=\"true\"><span class=\"dp-icon-content\" style=\"display: none;\">&nbsp;</span></i> <strong><a style=\"color: #ffffff; text-decoration: none;\" href=\"https://ufl.instructure.com/courses/505767/modules/items/10873182\" data-api-endpoint=\"\">Return to Module 3</a></strong></p>\n</div>\n</div>",
        "due_at": "2024-02-02T21:30:00Z",
        "unlock_at": "2024-02-02T20:10:00Z",
        "lock_at": "2024-02-02T21:30:00Z",
        "points_possible": 20,
        "grading_type": "points",
        "assignment_group_id": 927784,
        "grading_standard_id": null,
        "created_at": "2024-01-09T15:24:10Z",
        "updated_at": "2024-02-03T01:19:05Z",
        "peer_reviews": false,
        "automatic_peer_reviews": false,
        "position": 3,
        "grade_group_students_individually": false,
        "anonymous_peer_reviews": false,
        "group_category_id": null,
        "post_to_sis": false,
        "moderated_grading": false,
        "omit_from_final_grade": false,
        "intra_group_peer_reviews": false,
        "anonymous_instructor_annotations": false,
        "anonymous_grading": false,
        "graders_anonymous_to_graders": false,
        "grader_count": 0,
        "grader_comments_visible_to_graders": true,
        "final_grader_id": null,
        "grader_names_visible_to_final_grader": true,
        "allowed_attempts": -1,
        "annotatable_attachment_id": null,
        "hide_in_gradebook": false,
        "lock_info": {
          "lock_at": "2024-02-02T21:30:00Z",
          "can_view": true,
          "asset_string": "assignment_6015489"
        },
        "secure_params": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsdGlfYXNzaWdubWVudF9pZCI6IjRlYTY2MjA0LTdhZTEtNGNjNC1iOWMzLTViOTNmMDMzZGMyOCIsImx0aV9hc3NpZ25tZW50X2Rlc2NyaXB0aW9uIjoiXHUwMDNjZGl2IGlkPVwia2xfd3JhcHBlcl8zXCIgY2xhc3M9XCJrbF9iYXNpY19jb2xvciBrbF93cmFwcGVyXCIgc3R5bGU9XCJtYXJnaW4tYm90dG9tOiAxNXB4OyBtYXJnaW4tdG9wOiAyNXB4O1wiXHUwMDNlXG5cdTAwM2NkaXYgaWQ9XCJrbF9jdXN0b21fYmxvY2tfOTBcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICMyZjJmNDE7IGNvbG9yOiAjZmZmZmZmOyBwYWRkaW5nLWJvdHRvbTogOHB4OyBwYWRkaW5nLXRvcDogOHB4OyBib3JkZXItYm90dG9tOiA0cHggc29saWQgIzgxZTVmYztcIlx1MDAzZVxuXHUwMDNjZGl2IGNsYXNzPVwia2xfZmxleF9jb2x1bW5zX3dyYXBwZXJcIiBzdHlsZT1cIm1hcmdpbi1yaWdodDogMjVweDsgbWFyZ2luLWxlZnQ6IDI1cHg7XCJcdTAwM2Vcblx1MDAzY2RpdiBjbGFzcz1cImtsX2ZsZXhfY29sdW1uXCIgc3R5bGU9XCJmbGV4OiAwIDAgYXV0bzsgZGlzcGxheTogZmxleDsgbWFyZ2luLXJpZ2h0OiAyNXB4O1wiXHUwMDNlXG5cdTAwM2NoMiBzdHlsZT1cImJvcmRlci1yaWdodDogNXB4IG5vbmUgIzZhZWVmMDsgbWFyZ2luOiA5cHggMHB4IDBweDsgY29sb3I6ICNmZmZmZmY7XCJcdTAwM2VcdTAwM2NzdHJvbmdcdTAwM2VcdTAwM2NzcGFuIHN0eWxlPVwiZm9udC1zaXplOiAxNnB0OyBib3JkZXItcmlnaHQ6IDVweCBzb2xpZCAjODFlNWZjOyBwYWRkaW5nLXRvcDogMTJweDsgcGFkZGluZy1yaWdodDogMjVweDsgcGFkZGluZy1ib3R0b206IDEwcHg7XCJcdTAwM2VNb2R1bGUgNFx1MDAzYy9zcGFuXHUwMDNlXHUwMDNjL3N0cm9uZ1x1MDAzZVx1MDAzYy9oMlx1MDAzZVxuXHUwMDNjL2Rpdlx1MDAzZVxuXHUwMDNjZGl2IGlkPVwia2xfYmFubmVyXCIgY2xhc3M9XCJrbF9mbGV4X2NvbHVtblwiIHN0eWxlPVwibWFyZ2luLWxlZnQ6IDBweDsgbWFyZ2luLXJpZ2h0OiAwcHg7IGNvbG9yOiAjZmZmZmZmOyBiYWNrZ3JvdW5kLWNvbG9yOiAjMmYyZjQxO1wiXHUwMDNlXG5cdTAwM2NoMiBzdHlsZT1cImNvbG9yOiAjZmZmZmZmO1wiXHUwMDNlXHUwMDNjc3BhbiBpZD1cImtsX2Jhbm5lcl9yaWdodFwiIHN0eWxlPVwiZm9udC1zaXplOiAyNXB0OyBjb2xvcjogI2ZmZmZmZjsgcGFkZGluZy1sZWZ0OiAwcHg7IGxpbmUtaGVpZ2h0OiBpbml0aWFsO1wiXHUwMDNlUGVydXNhbGwgUmVhZGluZzogU29mdHdhcmUgQ29uZmkuLi4gKHRydW5jYXRlZCkifQ.omVSXV9qsa3Dd33TB3l4iUMyuEEbllOO44rqj_fSR2k",
        "lti_context_id": "4ea66204-7ae1-4cc4-b9c3-5b93f033dc28",
        "course_id": 505767,
        "name": "Module 4: In-class Reading - Software Configuration Management Practices for eXtreme Programming Teams",
        "submission_types": [
          "online_text_entry"
        ],
        "has_submitted_submissions": false,
        "due_date_required": false,
        "max_name_length": 255,
        "in_closed_grading_period": false,
        "graded_submissions_exist": true,
        "is_quiz_assignment": false,
        "can_duplicate": true,
        "original_course_id": null,
        "original_assignment_id": null,
        "original_lti_resource_link_id": null,
        "original_assignment_name": null,
        "original_quiz_id": null,
        "workflow_state": "published",
        "important_dates": false,
        "muted": true,
        "html_url": "https://ufl.instructure.com/courses/505767/assignments/6015489",
        "published": true,
        "only_visible_to_overrides": false,
        "locked_for_user": true,
        "lock_explanation": "This assignment was locked Feb 2 at 4:30pm.",
        "submissions_download_url": "https://ufl.instructure.com/courses/505767/assignments/6015489/submissions?zip=1",
        "post_manually": false,
        "anonymize_students": false,
        "require_lockdown_browser": false,
        "restrict_quantitative_data": false
      }
    ]

    const transformed = [
      [6015471, "Module 12: Sprint 1 Presentation", "2024-03-30T03:59:59Z", 55],
      [6015465, "Module 12: Peer Evaluation 2", "2024-04-06T03:59:00Z", 10]
    ]

    axios.get.mockResolvedValue({ data: mockAssignments })
    const result = await canvas.getAssignments("token", "123", Date.parse("2024-03-22T22:10:39Z"))
    expect(result).toEqual(transformed)
  })

})
