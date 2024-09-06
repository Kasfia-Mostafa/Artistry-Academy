import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { TUserRole } from '../modules/User/user.interface';
import { User } from '../modules/User/user.model';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization
      // console.log(token);
      // Validate token presence and format
      if (!token) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'No token provided or wrong format!',
        );
      }

      let decoded;
      try {
        decoded = jwt.verify(
          token,
          config.jwt_access_secret as string,
        ) as JwtPayload;
      } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorize');
      }
      // console.log(decoded);
      const { role, userId, iat } = decoded;

      // Check if user exists
      const user = await User.isUserExistsByCustomId(userId);
      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
      }

      // Check if user is deleted or blocked
      if (user.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!');
      }
      if (user.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked!');
      }

      // Check if password was changed after token issuance
      if (
        user.passwordChangedAt &&
        User.isJWTIssuedBeforePasswordChanged(
          user.passwordChangedAt,
          iat as number,
        )
      ) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'Token is invalid after password change!',
        );
      }

      // Check for role authorization
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          'You do not have the required role!',
        );
      }

      req.user = decoded as JwtPayload & { role: string };
      next();
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid token',
          errorSources: [{ path: '', message: 'Invalid token' }],
          err: { statusCode: httpStatus.UNAUTHORIZED },
        });
      } else if (err instanceof jwt.TokenExpiredError) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Token expired',
          errorSources: [{ path: '', message: 'Token expired' }],
          err: { statusCode: httpStatus.UNAUTHORIZED },
        });
      }

      next(err); // Handle any other errors
    }
  });
};

export default auth;
