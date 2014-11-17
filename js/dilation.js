/**
Time dilation calculator library

By David Jonas

Licence GNU GPLv3 - www.gnu.org/licenses/gpl.html

WARNING: When working with large numbers keep in mind the limitations of javascript:

*** Values bigger than 1e15 can have unexpected results example:
var value = 1e16
value
>>> 10000000000000000
value+1
>>> 10000000000000000
value == value+1
>>> true

*** limits are defined by the following constants:

//The smallest interval between two representable numbers
Number.EPSILON
>>> 2.220446049250313e-16

//The maximum safe integer in JavaScript = pow(2,53) - 1
Number.MAX_SAFE_INTEGER
>>> 9007199254740991

//The minimum safe integer in JavaScript = -(pow(2, 53) -1)
Number.MIN_SAFE_INTEGER
>>> -9007199254740991

//The largest positive representable number.
Number.MAX_VALUE
>>> 1.7976931348623157e+308

//The smallest positive representable number - that is, the positive number closest to zero (without actually being zero).
Number.MIN_VALUE
>>> 5e-324

**/

//Class to represent an interval of time in a combination of different units
//Arguments:
//config (Object) = A configuration object with ONE OR MORE of the following example keyword arguments:
//
//var ti = new TimeInterval({'days': 365, 'hours': 6, 'seconds': 0, 'milliseconds': 0});

var c = 299792458;

function TimeInterval(config)
{
  if (config['days'] !== undefined)
  {
    this.days = config['days'];
  }
  else
  {
    this.days = 0;
  }

  if (config['hours'] !== undefined)
  {
    this.hours = config['hours'];
  }
  else
  {
    this.hours = 0;
  }

  if (config['minutes'] !== undefined)
  {
    this.minutes = config['minutes'];
  }
  else
  {
    this.minutes = 0;
  }

  if (config['seconds'] !== undefined)
  {
    this.seconds = config['seconds'];
  }
  else
  {
    this.seconds = 0;
  }

  if (config['milliseconds'] !== undefined)
  {
    this.milliseconds = config['milliseconds'];
  }
  else
  {
    this.milliseconds = 0;
  }
};

TimeInterval.prototype =
{
  //Calculate the total days of the the time interval
  //Returns:
  //Time interval in days
  totalDays:function()
  {
    var result = this.days;
    result += this.hours / 24.0;
    result += this.minutes / 1440;
    result += this.seconds / 86400;
    result += this.milliseconds / 8.64e+7;

    return result;
  },
  //Calculate the total hours of the the time interval
  //Returns:
  //Time interval in hours
  totalHours:function()
  {
    var result = this.hours;
    result += this.days * 24;
    result += this.minutes / 60;
    result += this.seconds / 3600;
    result += this.milliseconds / 3.6e+6;

    return result;
  },
  //Calculate the total minutes of the the time interval
  //Returns:
  //Time interval in minutes
  totalMinutes:function()
  {
    var result = this.minutes;
    result += this.days * 1440;
    result += this.hours * 60;
    result += this.seconds / 60;
    result += this.milliseconds / 60000;

    return result;
  },
  //Calculate the total seconds of the the time interval
  //Returns:
  //Time interval in seconds
  totalSeconds:function()
  {
    var result = this.seconds;
    result += this.days * 86400;
    result += this.hours * 3600;
    result += this.minutes * 60;
    result += this.milliseconds / 1000.0;

    return result;
  },
  //Calculate the total milliseconds of the the time interval
  //Returns:
  //Time interval in milliseconds
  totalMilliseconds:function()
  {
    var result = this.milliseconds;
    result += this.days * 8.64e+7;
    result += this.hours * 3.6e+6;
    result += this.minutes * 60000;
    result += this.seconds * 1000;

    return result;
  }
};

//Class to represent a speed and take care of unit conversions
//Constructor arguments:
//value (Number) = The value of the speed
//unit (String) = The unit of speed
//  'm/s' = Meters per second.
//  'Km/s' = Kilometers per second.
//  'Km/h' = Kilometers per hour.
//  'mph' = Miles per hour.
//  'pc' = percentage of light speed.
function Speed(value, unit)
{
  if (unit === 'm/s')
  {
    this.ms = value;
    this.kms = this.ms / 1000;
    this.kmh = this.kms * 3600;
    this.mph = this.kmh * 0.621371;
    this.pc =  this.ms / c * 100;
  }
  if (unit === 'Km/s')
  {
    this.kms = value;
    this.ms = this.kms * 1000;
    this.kmh = (this.ms / 1000) * 3600
    this.mph = this.kmh * 0.621371
    this.pc = this.ms / c * 100
  }
  if (unit === 'Km/h')
  {
    this.kmh = value;
    this.kms = this.kmh / 3600;
    this.ms = this.kms * 1000;
    this.mph = this.kmh * 0.621371
    this.pc =  this.ms / c * 100
  }
  if (unit === 'mph')
  {
    this.mph = value;
    this.kmh = this.mph * 1.60934;
    this.kms = this.kmh / 3600;
    this.ms = this.kms * 1000;
    this.pc = this.ms / c * 100;
  }
  if (unit === 'pc')
  {
    this.pc = value;
    this.ms = c * this.pc / 100;
    this.kms = this.ms / 1000;
    this.kmh = this.kms / 3600;
    this.mph = this.kmh * 0.621371;
  }
}

//Static calculation library. Should not be instanciated, use the global variable td to call all the methods.
function TimeDilation ()
{

};

TimeDilation.prototype =
{
  //Calculates time variation relative to an inercial observer when traveling at a given relative speed.
  //Arguments:
  //speed (Speed) = Speed of the observed relative to the observer
  //Returns (number):
  //Time dilation factor, number of seconds the observer experiences while the observed experiences 1 second
  timeDilationFactor:function (speed)
  {
    var timeDifference = 1 / Math.sqrt(1 - (Math.pow(speed.ms, 2)/Math.pow(c,2)));
    return timeDifference;
  },
  //Calculates how many seconds one gains by traveling at a determined speed for a determined interval of time relative to an inertial observer
  //Arguments:
  //speed (Speed) = Speed of the observed relative to the observer in meters per second.
  //interval (TimeInterval) = time interval for which the observed travels
  //Returns (TimeInterval):
  //Amount of time "gained" by the observed by travelling at speed for that interval in seconds per interval.
  gainPerInterval:function(speed, interval)
  {
    var intervalInSeconds = interval.totalSeconds();
    var dilated = intervalInSeconds * this.timeDilationFactor(speed);
    return new TimeInterval({'seconds':dilated - intervalInSeconds});
  },
  //Calculates the percentage of dilation observed by
  //an inertial observer relative to the time experienced
  //by the observed traveling at a predetermined constant speed relative to the observer
  //for a predetermined time interval.
  //Arguments:
  //speed (Speed) = Speed of the observed relative to the observer.
  //Returns (Number):
  //The percentage of dilation of time experienced by the observed relative to the observer.
  percentageOfDilation:function(speed)
  {
    return this.gainPerInterval(speed, new TimeInterval({'seconds':100})).totalSeconds();
  }
};

var td = new TimeDilation();
