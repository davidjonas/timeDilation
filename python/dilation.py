# Velocities measured in m/s and time in seconds

from math import sqrt, pow

class TimeDilation:

    c = 299792458

    def dilation(self, speed):
        secondsPerSecond = 1 / sqrt(1 - (pow(speed, 2)/pow(self.c,2)))
        return secondsPerSecond

    def variationPerInterval(self, velocity, interval):
        seconds = interval.total_seconds()
        dilated = seconds * self.dilation(velocity)
        return dilated - seconds
