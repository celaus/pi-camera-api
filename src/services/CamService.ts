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

import { Raspistill } from "node-raspistill";

export class CamService {
    private cameraInstance: Raspistill;

    constructor(w: number, h: number, timeout: number) {
        this.cameraInstance = new Raspistill({
            width: w,
            height: h,
            time: timeout,
            encoding: 'png',
            noFileSave: true
        });
    }

    takePhoto(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const result = new Array(10240000).map((n) => 8);
            resolve(new Buffer(result));
        });//this.cameraInstance.takePhoto();
    }
}
