import { Router, Request, Response, NextFunction } from 'express';
import { Raspistill } from "node-raspistill";

export class CamRouter {
    router: Router

    /**
     * Initialize the HeroRouter
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    /**
     * GET one hero by id
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

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/take', this.takePhoto);
    }
}

// Create the HeroRouter, and export its configured Express.Router
const camRoutes = new CamRouter();
camRoutes.init();

export default camRoutes.router;