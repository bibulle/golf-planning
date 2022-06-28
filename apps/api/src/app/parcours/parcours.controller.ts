import { ParcoursResa } from "@golf-planning/api-interfaces";
import { Controller, Get, Logger, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ParcoursService } from "./parcours.service";

@Controller()
export class ParcoursController {
  private readonly logger = new Logger(ParcoursController.name);

  constructor(private readonly _parcoursService: ParcoursService) {}

  @Get('parcours')
  @UseGuards(AuthGuard('jwt'))
  async getCourses(): Promise<ParcoursResa[]> {
    return this._parcoursService.getParcours();
  }

}
