import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Tabs, 
  Tab, 
  Chip, 
  LinearProgress,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  Select,
  InputLabel
} from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  Area,
  RadialBarChart,
  RadialBar,
  ComposedChart
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ScaleIcon from '@mui/icons-material/Scale';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface TabPanelProps {
  readonly children?: React.ReactNode;
  readonly index: number;
  readonly value: number;
}

function TabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" color={color}>
            {value}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {change >= 0 ? (
              <TrendingUpIcon color="success" fontSize="small" />
            ) : (
              <TrendingDownIcon color="error" fontSize="small" />
            )}
            <Typography 
              variant="body2" 
              color={change >= 0 ? 'success.main' : 'error.main'}
              sx={{ ml: 0.5 }}
            >
              {change >= 0 ? '+' : ''}{change}%
            </Typography>
          </Box>
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const Analytics: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timeFilter, setTimeFilter] = useState('7');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Sample analytics data
  const weightProgress = [
    { date: '2024-01-01', weight: 75.0, bmi: 24.2, bodyFat: 18.5 },
    { date: '2024-01-08', weight: 74.5, bmi: 24.0, bodyFat: 18.2 },
    { date: '2024-01-15', weight: 74.2, bmi: 23.9, bodyFat: 18.0 },
    { date: '2024-01-22', weight: 73.8, bmi: 23.8, bodyFat: 17.8 },
    { date: '2024-01-29', weight: 73.5, bmi: 23.7, bodyFat: 17.5 },
    { date: '2024-02-05', weight: 73.2, bmi: 23.6, bodyFat: 17.3 },
    { date: '2024-02-12', weight: 73.0, bmi: 23.5, bodyFat: 17.0 },
  ];

  const caloriesData = [
    { date: '2024-02-06', burned: 450, consumed: 2200, deficit: 250 },
    { date: '2024-02-07', burned: 320, consumed: 2100, deficit: 180 },
    { date: '2024-02-08', burned: 580, consumed: 2300, deficit: 320 },
    { date: '2024-02-09', burned: 290, consumed: 2050, deficit: 240 },
    { date: '2024-02-10', burned: 490, consumed: 2180, deficit: 310 },
    { date: '2024-02-11', burned: 720, consumed: 2400, deficit: 320 },
    { date: '2024-02-12', burned: 380, consumed: 2150, deficit: 230 },
  ];

  const workoutIntensity = [
    { day: 'Mon', cardio: 60, strength: 45, flexibility: 20, intensity: 75 },
    { day: 'Tue', cardio: 30, strength: 60, flexibility: 15, intensity: 80 },
    { day: 'Wed', cardio: 45, strength: 0, flexibility: 30, intensity: 45 },
    { day: 'Thu', cardio: 0, strength: 75, flexibility: 15, intensity: 85 },
    { day: 'Fri', cardio: 90, strength: 30, flexibility: 20, intensity: 70 },
    { day: 'Sat', cardio: 120, strength: 90, flexibility: 30, intensity: 90 },
    { day: 'Sun', cardio: 25, strength: 0, flexibility: 45, intensity: 30 },
  ];

  const performanceMetrics = [
    { name: 'Endurance', current: 85, target: 90 },
    { name: 'Strength', current: 78, target: 85 },
    { name: 'Flexibility', current: 65, target: 75 },
    { name: 'Recovery', current: 72, target: 80 },
  ];

  const heartRateZones = [
    { zone: 'Zone 1 (Fat Burn)', percentage: 35, color: '#4caf50' },
    { zone: 'Zone 2 (Aerobic)', percentage: 40, color: '#2196f3' },
    { zone: 'Zone 3 (Anaerobic)', percentage: 20, color: '#ff9800' },
    { zone: 'Zone 4 (VO2 Max)', percentage: 5, color: '#f44336' },
  ];

  const monthlyGoals = [
    { goal: 'Weight Loss', current: 3.2, target: 5.0, unit: 'kg', progress: 64 },
    { goal: 'Workout Days', current: 18, target: 20, unit: 'days', progress: 90 },
    { goal: 'Calories Burned', current: 8500, target: 10000, unit: 'cal', progress: 85 },
    { goal: 'Steps', current: 285000, target: 300000, unit: 'steps', progress: 95 },
  ];

  const bodyComposition = [
    { metric: 'Muscle Mass', value: 65.2, change: +0.8, unit: 'kg' },
    { metric: 'Body Fat', value: 17.0, change: -1.5, unit: '%' },
    { metric: 'Water %', value: 62.5, change: +0.3, unit: '%' },
    { metric: 'Bone Mass', value: 3.2, change: 0, unit: 'kg' },
  ];

  const sleepRecovery = [
    { date: '2024-02-06', sleep: 7.5, quality: 85, recovery: 78 },
    { date: '2024-02-07', sleep: 8.2, quality: 90, recovery: 85 },
    { date: '2024-02-08', sleep: 6.8, quality: 75, recovery: 70 },
    { date: '2024-02-09', sleep: 7.8, quality: 88, recovery: 82 },
    { date: '2024-02-10', sleep: 8.0, quality: 92, recovery: 88 },
    { date: '2024-02-11', sleep: 7.2, quality: 80, recovery: 75 },
    { date: '2024-02-12', sleep: 8.5, quality: 95, recovery: 92 },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              📊 Progress Tracking & Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Comprehensive insights into your fitness journey
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Period</InputLabel>
              <Select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                label="Time Period"
              >
                <MenuItem value="7">Last 7 Days</MenuItem>
                <MenuItem value="30">Last 30 Days</MenuItem>
                <MenuItem value="90">Last 3 Months</MenuItem>
                <MenuItem value="365">Last Year</MenuItem>
              </Select>
            </FormControl>
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>Export Data</MenuItem>
              <MenuItem onClick={handleMenuClose}>Share Report</MenuItem>
              <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Key Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Current Weight"
              value="73.0 kg"
              change={-4.2}
              icon={<ScaleIcon />}
              color="primary.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Calories Burned"
              value="8,420"
              change={12.5}
              icon={<LocalFireDepartmentIcon />}
              color="error.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Workouts This Month"
              value="18"
              change={8.3}
              icon={<FitnessCenterIcon />}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Average Heart Rate"
              value="142 bpm"
              change={2.1}
              icon={<FavoriteIcon />}
              color="info.main"
            />
          </Grid>
        </Grid>

        {/* Tabs */}
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Body Composition" />
            <Tab label="Performance" />
            <Tab label="Nutrition" />
            <Tab label="Recovery" />
          </Tabs>

          {/* Body Composition Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {/* Weight & BMI Progress */}
              <Grid item xs={12} lg={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Weight & BMI Progress
                    </Typography>
                    <ResponsiveContainer width="100%" height={350}>
                      <ComposedChart data={weightProgress}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                        <YAxis yAxisId="weight" orientation="left" />
                        <YAxis yAxisId="bmi" orientation="right" />
                        <Tooltip 
                          labelFormatter={(date) => new Date(date).toLocaleDateString()}
                          formatter={(value, name) => {
                            let unit: string;
                            let label: string;
                            
                            if (name === 'weight') {
                              unit = 'kg';
                              label = 'Weight';
                            } else if (name === 'bmi') {
                              unit = 'BMI';
                              label = 'BMI';
                            } else {
                              unit = '%';
                              label = 'Body Fat';
                            }
                            
                            return [`${value} ${unit}`, label];
                          }}
                        />
                        <Area yAxisId="weight" type="monotone" dataKey="weight" fill="#2196f3" fillOpacity={0.3} stroke="#2196f3" strokeWidth={3} />
                        <Line yAxisId="bmi" type="monotone" dataKey="bmi" stroke="#ff9800" strokeWidth={3} dot={{ fill: '#ff9800' }} />
                        <Line yAxisId="weight" type="monotone" dataKey="bodyFat" stroke="#4caf50" strokeWidth={3} dot={{ fill: '#4caf50' }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Body Composition Breakdown */}
              <Grid item xs={12} lg={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Body Composition
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {bodyComposition.map((item) => (
                        <Box key={item.metric} sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" fontWeight="medium">
                              {item.metric}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" fontWeight="bold">
                                {item.value}{item.unit}
                              </Typography>
                              <Chip
                                label={`${item.change >= 0 ? '+' : ''}${item.change}${item.unit}`}
                                size="small"
                                color={(() => {
                                  if (item.change > 0) {
                                    return item.metric === 'Body Fat' ? 'error' : 'success';
                                  }
                                  if (item.change < 0) {
                                    return item.metric === 'Body Fat' ? 'success' : 'error';
                                  }
                                  return 'default';
                                })()}
                                sx={{ ml: 1, fontSize: '0.75rem' }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Monthly Goals */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Monthly Goals Progress
                    </Typography>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      {monthlyGoals.map((goal) => (
                        <Grid item xs={12} sm={6} md={3} key={goal.goal}>
                          <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h4" fontWeight="bold" color="primary.main">
                              {goal.progress}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {goal.goal}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={goal.progress}
                              sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                mt: 1,
                                backgroundColor: '#f0f0f0',
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 4,
                                  backgroundColor: (() => {
                                    if (goal.progress > 90) return '#4caf50';
                                    if (goal.progress > 70) return '#2196f3';
                                    return '#ff9800';
                                  })()
                                }
                              }}
                            />
                            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                              {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Performance Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {/* Workout Intensity & Volume */}
              <Grid item xs={12} lg={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Weekly Workout Intensity & Volume
                    </Typography>
                    <ResponsiveContainer width="100%" height={350}>
                      <ComposedChart data={workoutIntensity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis yAxisId="duration" />
                        <YAxis yAxisId="intensity" orientation="right" />
                        <Tooltip />
                        <Bar yAxisId="duration" dataKey="cardio" stackId="a" fill="#f44336" />
                        <Bar yAxisId="duration" dataKey="strength" stackId="a" fill="#2196f3" />
                        <Bar yAxisId="duration" dataKey="flexibility" stackId="a" fill="#4caf50" />
                        <Line yAxisId="intensity" type="monotone" dataKey="intensity" stroke="#ff9800" strokeWidth={3} dot={{ fill: '#ff9800', strokeWidth: 2, r: 6 }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: '#f44336', mr: 1 }} />
                        <Typography variant="body2">Cardio</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: '#2196f3', mr: 1 }} />
                        <Typography variant="body2">Strength</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: '#4caf50', mr: 1 }} />
                        <Typography variant="body2">Flexibility</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 12, height: 3, backgroundColor: '#ff9800', mr: 1 }} />
                        <Typography variant="body2">Intensity</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Performance Metrics */}
              <Grid item xs={12} lg={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Performance Metrics
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadialBarChart innerRadius="10%" outerRadius="80%" data={performanceMetrics}>
                        <RadialBar dataKey="current" cornerRadius={10} fill="#2196f3" />
                        <Tooltip formatter={(value) => [`${value}%`, 'Current']} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <Box sx={{ mt: 2 }}>
                      {performanceMetrics.map((metric) => (
                        <Box key={metric.name} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">{metric.name}</Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {metric.current}% / {metric.target}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(metric.current / metric.target) * 100}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Heart Rate Zones */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Heart Rate Training Zones
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={heartRateZones}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="percentage"
                          label={({ name, percentage }) => `${percentage}%`}
                        >
                          {heartRateZones.map((entry) => (
                            <Cell key={entry.zone} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Time Spent']} />
                      </PieChart>
                    </ResponsiveContainer>
                    <Box sx={{ mt: 2 }}>
                      {heartRateZones.map((zone) => (
                        <Box key={zone.zone} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              backgroundColor: zone.color,
                              borderRadius: '50%',
                              mr: 1
                            }}
                          />
                          <Typography variant="body2">
                            {zone.zone}: {zone.percentage}%
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Nutrition Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              {/* Calories Tracking */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Daily Calories Analysis
                    </Typography>
                    <ResponsiveContainer width="100%" height={350}>
                      <ComposedChart data={caloriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(date) => new Date(date).toLocaleDateString()}
                          formatter={(value, name) => {
                            let label: string;
                            if (name === 'burned') {
                              label = 'Burned';
                            } else if (name === 'consumed') {
                              label = 'Consumed';
                            } else {
                              label = 'Deficit';
                            }
                            return [`${value} cal`, label];
                          }}
                        />
                        <Bar dataKey="consumed" fill="#2196f3" />
                        <Bar dataKey="burned" fill="#f44336" />
                        <Line type="monotone" dataKey="deficit" stroke="#4caf50" strokeWidth={3} dot={{ fill: '#4caf50' }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Recovery Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              {/* Sleep & Recovery */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Sleep Quality & Recovery Metrics
                    </Typography>
                    <ResponsiveContainer width="100%" height={350}>
                      <ComposedChart data={sleepRecovery}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                        <YAxis yAxisId="hours" />
                        <YAxis yAxisId="percentage" orientation="right" />
                        <Tooltip 
                          labelFormatter={(date) => new Date(date).toLocaleDateString()}
                          formatter={(value, name) => {
                            const unit = name === 'sleep' ? 'hours' : '%';
                            let label: string;
                            if (name === 'sleep') {
                              label = 'Sleep Duration';
                            } else if (name === 'quality') {
                              label = 'Sleep Quality';
                            } else {
                              label = 'Recovery Score';
                            }
                            return [`${value} ${unit}`, label];
                          }}
                        />
                        <Bar yAxisId="hours" dataKey="sleep" fill="#2196f3" />
                        <Line yAxisId="percentage" type="monotone" dataKey="quality" stroke="#4caf50" strokeWidth={3} dot={{ fill: '#4caf50' }} />
                        <Line yAxisId="percentage" type="monotone" dataKey="recovery" stroke="#ff9800" strokeWidth={3} dot={{ fill: '#ff9800' }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: '#2196f3', mr: 1 }} />
                        <Typography variant="body2">Sleep Duration (hours)</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 12, height: 3, backgroundColor: '#4caf50', mr: 1 }} />
                        <Typography variant="body2">Sleep Quality (%)</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 12, height: 3, backgroundColor: '#ff9800', mr: 1 }} />
                        <Typography variant="body2">Recovery Score (%)</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default Analytics;
