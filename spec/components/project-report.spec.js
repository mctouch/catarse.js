/*
Test if project reports forms are rendered
 */

import m from 'mithril';
import projectReport from '../../src/c/project-report.js';

describe('ProjectReport', () => {
    let $projectReportMountedComponent;

    describe('view', () => {
        beforeAll(() => {
            const user = {"id":2,"user_id":2,"common_id":"bdb1a3d1-7d02-4767-baad-18abdf3be236","public_name":"","email":"oaijsdoijasd","name":"poaksdpokasd","contributions":0,"projects":0,"published_projects":0,"created":"2018-04-25T17:09:32.957-03:00","has_fb_auth":false,"has_online_project":false,"has_created_post":false,"last_login":"2018-05-16T21:55:28.100-03:00","created_today":false,"follows_count":0,"followers_count":0,"is_admin_role":false};

            $projectReportMountedComponent = mq(m.component(projectReport, {project :{project_id: 1}, user}));

            $projectReportMountedComponent.click('button.btn.btn-terciary.btn-inline.btn-medium.w-button'); 
        });

        it('Should render normal report', () => {
            expect($projectReportMountedComponent.contains('This project violates our rules..')).toBeTrue();
        });

        it('Should render intellectual property violation complaint form', () => {
            expect($projectReportMountedComponent.contains('This project infringes intellectual property')).toBeTrue();
        });

        it('Should render reward not received', () => {
            expect($projectReportMountedComponent.contains('I supported this project and have not received the reward yet')).toBeTrue();
        });
    });
});
