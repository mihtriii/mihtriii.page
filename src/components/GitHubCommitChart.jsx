import React, { useEffect, useState } from 'react';
import { github } from '../config/site.js';

export default function GitHubCommitChart() {
  const [commitData, setCommitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCommitActivity = async () => {
      try {
        // Fetch commit activity for the last year
        const response = await fetch(
          `https://api.github.com/users/${github.username}/events?per_page=100`
        );
        if (!response.ok) throw new Error('Failed to fetch commit data');

        const events = await response.json();

        // Filter push events and count commits by date
        const commitsByDate = {};
        const today = new Date();
        const oneYearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);

        // Initialize all dates in the last year with 0 commits
        for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          commitsByDate[dateStr] = 0;
        }

        // Count commits from push events
        events.forEach((event) => {
          if (event.type === 'PushEvent') {
            const date = new Date(event.created_at).toISOString().split('T')[0];
            if (commitsByDate.hasOwnProperty(date)) {
              commitsByDate[date] += event.payload.commits?.length || 1;
            }
          }
        });

        // Convert to array format for chart
        const chartData = Object.entries(commitsByDate).map(([date, commits]) => ({
          date,
          commits,
          level: commits === 0 ? 0 : commits <= 2 ? 1 : commits <= 5 ? 2 : commits <= 10 ? 3 : 4,
        }));

        setCommitData(chartData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommitActivity();
  }, []);

  const getWeekData = () => {
    const weeks = [];
    const data = [...commitData];

    while (data.length > 0) {
      weeks.push(data.splice(0, 7));
    }

    return weeks;
  };

  const getMonthLabels = () => {
    const months = [];
    const weeks = getWeekData();

    weeks.forEach((week, index) => {
      if (week.length > 0 && index % 4 === 0) {
        // Show label every 4 weeks
        const date = new Date(week[0].date);
        months.push({
          index,
          month: date.toLocaleDateString('en', { month: 'short' }),
        });
      }
    });

    return months;
  };

  const getLevelColor = (level) => {
    // Get current theme
    const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';

    if (isDark) {
      const colors = {
        0: '#161b22',
        1: '#0e4429',
        2: '#006d32',
        3: '#26a641',
        4: '#39d353',
      };
      return colors[level] || colors[0];
    } else {
      const colors = {
        0: '#ebedf0',
        1: '#9be9a8',
        2: '#40c463',
        3: '#30a14e',
        4: '#216e39',
      };
      return colors[level] || colors[0];
    }
  };

  if (loading) {
    return (
      <div className="card card-elevate">
        <div className="card-body">
          <h6 className="card-title">
            <i className="bi bi-graph-up me-2"></i>
            Commit Activity
          </h6>
          <div className="placeholder-glow">
            <div className="placeholder" style={{ height: '100px', width: '100%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card card-elevate">
        <div className="card-body">
          <h6 className="card-title">
            <i className="bi bi-graph-up me-2"></i>
            Commit Activity
          </h6>
          <div className="text-muted small">
            <i className="bi bi-exclamation-circle me-1"></i>
            Unable to load commit data
          </div>
        </div>
      </div>
    );
  }

  const weeks = getWeekData();
  const monthLabels = getMonthLabels();
  const totalCommits = commitData.reduce((sum, day) => sum + day.commits, 0);
  const maxCommits = Math.max(...commitData.map((day) => day.commits));

  return (
    <div className="card card-elevate">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="card-title mb-0">
            <i className="bi bi-graph-up me-2"></i>
            GitHub Activity
          </h6>
          <div className="text-muted small">{totalCommits} commits this year</div>
        </div>

        <div className="commit-chart mb-3">
          <div className="d-flex gap-1" style={{ overflowX: 'auto', padding: '4px' }}>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="d-flex flex-column gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="commit-square"
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: getLevelColor(day.level),
                      borderRadius: '2px',
                      border: '1px solid rgba(27, 31, 35, 0.06)',
                    }}
                    title={`${new Date(day.date).toLocaleDateString()}: ${day.commits} commits`}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Month labels */}
        <div className="d-flex gap-1 mb-3" style={{ paddingLeft: '4px' }}>
          {weeks.map((week, index) => (
            <div key={index} style={{ width: '12px', marginRight: '1px' }}>
              {monthLabels.find((label) => label.index === index) && (
                <small className="text-muted" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                  {monthLabels.find((label) => label.index === index).month}
                </small>
              )}
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-center text-muted small">
          <span>Less</span>
          <div className="d-flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: getLevelColor(level),
                  borderRadius: '2px',
                  border: '1px solid rgba(27, 31, 35, 0.06)',
                }}
              ></div>
            ))}
          </div>
          <span>More</span>
        </div>

        {maxCommits > 0 && (
          <div className="mt-2 text-muted small">
            <i className="bi bi-trophy me-1"></i>
            Best day: {maxCommits} commits
          </div>
        )}
      </div>
    </div>
  );
}
