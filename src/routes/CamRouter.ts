import { Router, Request, Response, NextFunction } from 'express';
import { Raspistill } from "node-raspistill";

export class CamRouter {
    router: Router


    constructor() {
        this.router = Router();
        this.init();
    }

    /**
     * Take a picture
     */
    public takePhoto(req: Request, res: Response, next: NextFunction) {
        const raspistill = new Raspistill();
        raspistill.takePhoto()
            .then((photo) => {
                res.status(200)
                    .contentType("image/bmp")
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