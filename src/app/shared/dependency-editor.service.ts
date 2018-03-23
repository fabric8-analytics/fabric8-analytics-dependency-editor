import {
    Injectable,
    Inject,
    EventEmitter,
    Output
} from '@angular/core';
import {
    Http,
    Response,
    Headers,
    RequestOptions
} from '@angular/http';
import {
    AuthenticationService
} from 'ngx-login-client';
import {
    Observable
} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/operators/map';
import * as _ from 'lodash';

import {
    StackReportModel,
    DependencySnapshotItem,
    ComponentInformationModel,
    CveResponseModel,
    DependencySearchItem,
    EventDataModel
} from '../model/data.model';
import {
    DependencySnapshot
} from '../utils/dependency-snapshot';

@Injectable()
export class DependencyEditorService {
    @Output() dependencySelected = new EventEmitter < DependencySearchItem > ();
    @Output() dependencyRemoved = new EventEmitter < EventDataModel > ();

    public STACK_API_TOKEN;
    public STACK_API_TOKEN_PROD;
    private headersProd: Headers = new Headers({
        'Content-Type': 'application/json'
    });
    private headersProdPost: Headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
    });
    private headersStagePost: Headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
    });
    private headersStage: Headers = new Headers({
        'Content-Type': 'application/json'
    });

    constructor(
        private http: Http,
        private auth: AuthenticationService
    ) {
    // pass your prod token here to run in local
    const prodToken = '';
    if (this.auth.getToken()) {
        this.headersStage.set('Authorization', 'Bearer ' + this.auth.getToken());
        this.headersStagePost.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.headersProd.set('Authorization', 'Bearer ' + prodToken);
    this.headersProdPost.set('Authorization', 'Bearer ' + prodToken);
    // pass your stage token here to run in local
    // this.headersStage.set('Authorization', 'Bearer ');
    }

    postStackAnalyses(githubUrl: string) {
        // const url = 'http://bayesian-api-rratnawa-fabric8-analytics.dev.rdu2c.fabric8.io/api/v1/stack-analyses';
        const url = 'https://recommender.api.prod-preview.openshift.io/api/v1/stack-analyses';
        const options = new RequestOptions({
            // headers: this.headersProdPost
            headers: this.headersStagePost
        });
        const payload = 'github_url=' + githubUrl;
        return this.http.post(url, payload, options)
            .map(this.extractData)
            .map((data) => {
                return data;
            })
            .catch(this.handleError);
    }

    getStackAnalyses(url: string): Observable < any > {
        const options = new RequestOptions({
            // headers: this.headersProd
            headers: this.headersStage
        });
        let stackReport: StackReportModel = null;
        return this.http.get(url, options)
            .map(this.extractData)
            .map((data) => {
                stackReport = data;
                return data;
            })
            .catch(this.handleError);
    }

    getDependencies(url: string): Observable < any > {
        const options = new RequestOptions({
            headers: this.headersStage
        });
        return this.http.get(url, options)
            .map(this.extractData)
            .map((data) => {
                return data;
            })
            .catch(this.handleError);
    }

    getDependencyData(url, payload): Observable < any > {
        const options = new RequestOptions({
            headers: this.headersStage
        });
        return this.http.post(url, payload, options)
            .map(this.extractData)
            .map((data: StackReportModel | CveResponseModel | any) => {
                return data;
            })
            .catch(this.handleError);
    }

    getDependencyData2(url, payload): Observable < any > {
    return this.http.get(url)
        .map(this.extractData)
        .map((data: StackReportModel | CveResponseModel | any) => {
            return data;
        })
        .catch(this.handleError);
    }

    getDependencyData1(url, payload): Observable < any > {
        const options = new RequestOptions({
            headers: this.headersProd
        });
        return this.http.post(url, payload, options)
            .map(this.extractData)
            .map((data: StackReportModel | CveResponseModel | any) => {
                return data;
            })
            .catch(this.handleError);
    }

    getCategories(url: string): Observable < any > {
        const options = new RequestOptions({
            headers: this.headersStage
        });
        return this.http.get(url)// , options)
            .map(this.extractData)
            .map((data) => {
                return data;
            })
            .catch(this.handleError);
    }

    updateDependencyAddedSnapshot(depObj: EventDataModel) {
        let depToAdd;
        if (depObj.depFull) {
            depToAdd = {
                package: depObj.depFull.name,
                version: depObj.depFull.version
            };
            if (depObj.action === 'add') {
                DependencySnapshot.DEP_FULL_ADDED.push(depObj.depFull);
            }
        } else if (depObj.depSnapshot) {
            depToAdd = depObj.depSnapshot;
        }
        if (depObj.action === 'add') {
            DependencySnapshot.DEP_SNAPSHOT_ADDED.push(depToAdd);
        } else {
            _.remove(DependencySnapshot.DEP_SNAPSHOT_ADDED, (dep) => {
                return dep.package === depToAdd.package;
            });
            _.remove(DependencySnapshot.DEP_FULL_ADDED, (dep) => {
                return dep.name === depToAdd.package;
            });
        }
    }

    getPayload() {
        const payload = {};
        const deps = DependencySnapshot.DEP_SNAPSHOT.concat(DependencySnapshot.DEP_SNAPSHOT_ADDED);
        payload['_resolved'] = deps;
        payload['ecosystem'] = DependencySnapshot.ECOSYSTEM;
        payload['request_id'] = DependencySnapshot.REQUEST_ID;
        return payload;
    }

    removeDependency(dependency: ComponentInformationModel) {
        const objToEmit: EventDataModel = {
            depFull: dependency,
            depSnapshot: null,
            action: 'remove'
        };
        this.dependencyRemoved.emit(objToEmit);
    }

    private extractData(res: Response) {
        const body = res.json() || {};
        body['statusCode'] = res.status;
        body['statusText'] = res.statusText;
        return body as StackReportModel;
    }

    private handleError(error: Response | any) {
        let body: any = {};
        if (error instanceof Response) {
            if (error && error.status && error.statusText) {
                body = {
                    status: error.status,
                    statusText: error.statusText
                };
            }
        } else {
            body = {
                statusText: error.message ? error.message : error.toString()
            };
        }
        return Observable.throw(body);
    }
}
