//    Copyright 2017 cm
// 
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
// 
//        http://www.apache.org/licenses/LICENSE-2.0
// 
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

import { Router, Request, Response, NextFunction } from 'express';
import { CamService } from '../services/CamService';

export class CamRouter {
    router: Router

    defaultImageWidth: number = 1920;
    defaultImageHeight: number = 1080;
    defaultTimeout: number = 0;

    constructor() {
        this.router = Router();
        this.init();
    }

    /**
     * Take a picture
     */
    public takePhoto(req: Request, res: Response, next: NextFunction) {
        const w = parseInt(req.query.width);
        const h = parseInt(req.query.height);
        const timeout = parseInt(req.query.timeout);

        new CamService(w === NaN ? this.defaultImageWidth : w,
            h === NaN ? this.defaultImageHeight : h,
            timeout === NaN ? this.defaultTimeout : timeout)
            .takePhoto()
            .then((photo) => {
                res.status(200)
                    .contentType("image/png")
                    .send(photo);
            })
            .catch((error) => {
                res.status(500)
                    .contentType("application/json")
                    .send({
                        message: 'Error',
                        status: res.status,
                        error: error
                    });
            });
    }


    init() {
        this.router.get('/take', this.takePhoto);
    }
}

const camRoutes = new CamRouter();
camRoutes.init();

export default camRoutes.router;