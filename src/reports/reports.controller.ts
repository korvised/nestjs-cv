import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CreateReportDto } from "./dtos/create-report.dto";
import { ReportsService } from "./reports.service";
import { AdminGuard } from "../guards/admin.guard";
import { AuthGuard } from "../guards/auth.guard";
import { User } from "../users/user.entity";
import { CurrentUser } from "../users/decorators/current-user.decorator";
import { Serialize } from "../interceptors/serialize.interceptor";
import { ReportDto } from "./dtos/report.dto";
import { ApproveReportDto } from "./dtos/approve-report.dto";
import { GetEstimateDto } from "./dtos/get-estimate.dto";

@Controller("reports")
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getEstimates(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch("/:id")
  @UseGuards(AdminGuard)
  approvedReport(@Param("id") id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(parseInt(id), body.approved);
  }
}
