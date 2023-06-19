import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { PostService } from '../post.service';

@Injectable()
export class PostOwnerGuard implements CanActivate {
  constructor(private readonly postService: PostService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const postId = request.params.id || request.params.postId;
    const userId = request.user.id;
    return this.postService.isOwnnerOfPost(postId, userId);
  }
}
