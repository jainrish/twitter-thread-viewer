import { formatMetricNumber } from '../utils/dateFormatter';

/**
 * TweetMetrics Component
 * Displays engagement metrics for a tweet (views, likes, replies, retweets)
 */
export default function TweetMetrics({ publicMetrics }) {
  if (!publicMetrics) return null;

  const metrics = [
    {
      icon: '👁',
      value: publicMetrics.impression_count,
      label: 'views',
      show: publicMetrics.impression_count > 0,
    },
    {
      icon: '❤️',
      value: publicMetrics.like_count,
      label: 'likes',
      show: publicMetrics.like_count > 0,
    },
    {
      icon: '💬',
      value: publicMetrics.reply_count,
      label: 'replies',
      show: publicMetrics.reply_count > 0,
    },
    {
      icon: '🔁',
      value: publicMetrics.retweet_count,
      label: 'retweets',
      show: publicMetrics.retweet_count > 0,
    },
  ];

  const visibleMetrics = metrics.filter(m => m.show);

  if (visibleMetrics.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
      {visibleMetrics.map((metric, index) => (
        <div key={index} className="flex items-center gap-1">
          <span>{metric.icon}</span>
          <span className="font-medium">{formatMetricNumber(metric.value)}</span>
        </div>
      ))}
    </div>
  );
}
