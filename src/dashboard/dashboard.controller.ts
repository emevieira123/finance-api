import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import dashboardSummary from './responses/dashboard-summary';
import pagamentosRecentes from './responses/pagamentos-recentes';

@ApiTags('Dashboards')
@Controller('api/dashboard')
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiResponse({
    schema: {
      default: dashboardSummary,
    },
  })
  @Get()
  findAll() {
    return this.dashboardService.findAll();
  }

  @ApiResponse({
    schema: {
      default: pagamentosRecentes,
    },
  })
  @Get('pagamentos-recentes')
  findPagamentosRecentes() {
    return this.dashboardService.findPagamentosRecentes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dashboardService.findOne(+id);
  }
}
