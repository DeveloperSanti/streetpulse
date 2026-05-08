export enum SocketEvents {
  CHALLENGE_RECEIVED      = 'challenge:received',
  CHALLENGE_ACCEPTED      = 'challenge:accepted',
  CHALLENGE_REJECTED      = 'challenge:rejected',
  CHALLENGE_CANCELLED     = 'challenge:cancelled',
  CHALLENGE_COMPLETED     = 'challenge:completed',
  CHALLENGE_RESULT_PENDING = 'challenge:result:pending',
  RANK_UPGRADED           = 'rank:upgraded',
  NOTIFICATION_NEW        = 'notification:new',
}