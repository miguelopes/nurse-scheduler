#!/usr/bin/python2

import nurse_schedule

while True:
    print("Press <Ctrl-C> to exit.")

    try:
	count_nurses = int(input("#nurses (default = 50): "))
    except SyntaxError:
	count_nurses = 50
    print("Using count_nurses = %s" % count_nurses)
    try:
	count_chiefs = int(input("#chiefs (default = 10): "))
    except SyntaxError:
	count_chiefs = 10
    print("Using count_chiefs = %s" % count_chiefs)
    print(nurse_schedule.make(count_nurses=count_nurses, count_chiefs=count_chiefs))
