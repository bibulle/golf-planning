import { ApiReturn, GlobalStatus } from '@golf-planning/api-interfaces';
import { Controller, Get, HttpException, HttpStatus, Logger, Res } from '@nestjs/common';
import { HealthService } from './health.service';
import { Response } from 'express';

@Controller('health')
export class HealthController {
  readonly logger = new Logger(HealthController.name);

  constructor(private _healthService: HealthService) {}

  @Get('')
  async getBStatus(@Res() res: Response) {
    // return new Promise<ApiReturn>((resolve) => {
      this._healthService
        .getHealthSattus()
        .then((status: GlobalStatus) => {
          if (status.golfStatus === 'OK') {
            res.status(HttpStatus.OK).json({ data: status });
          } else {
            res.status(215).json({ data: status });
          }
        })
        .catch((err) => {
          this.logger.error(err);
          throw new HttpException('Something go wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        });
    // });
  }

}
