import { Router, Request, Response, NextFunction } from 'express';
import { Raspistill } from "node-raspistill";


export class CamRouter {
    router: Router

    defaultImageWidth: number = 1920;
    defaultImageHeight: number = 1080;


    constructor() {
        this.router = Router();
        this.init();
    }

    /**
     * Take a picture
     */
    public takePhoto(req: Request, res: Response, next: NextFunction) {
        var w = parseInt(req.query.width);
        var h = parseInt(req.query.height);
        var timeout = parseInt(req.query.timeout);

        const raspistill = new Raspistill({
            width: w === NaN ? this.defaultImageWidth : w,
            height: h === NaN ? this.defaultImageHeight : h,
            time: timeout === NaN ? 0 : timeout,
            encoding: 'png'
        });

        raspistill.takePhoto()
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