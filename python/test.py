#Testing values for the dilation class
from dilation import TimeDilation
from datetime import timedelta

interval = timedelta(days=365, hours=6)
#interval = timedelta(days=2)

speed = 7666.74

dilation = TimeDilation()
variation = dilation.variationPerInterval(speed, interval)
print("%s seconds gained." % variation)
