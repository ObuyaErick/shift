import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeOrmFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    let message: string;
    let error: string;
    let status = 500;

    switch (exception.constructor) {
      case QueryFailedError:
        status = 500;
        error = 'Internal Server Error';
        message = 'Failed to satisfy query';
        break;
      case EntityNotFoundError:
        const s = String((exception as any).entityClass).slice(6);
        status = 404;
        error = 'Not Found';
        message = `${s.slice(0, s.indexOf(' '))} not found`;
        break;
      default:
        // handle it like internal server error
        status = 500;
        error = 'Internal Server Error';
        message = 'Sorry an internal server error occured';
    }

    response.status(status).json({ error, message, statusCode: status });
  }
}
