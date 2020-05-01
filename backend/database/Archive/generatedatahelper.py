import csv
import random
import numpy as np
from datetime import datetime, timedelta,date

row = 7 #7days
col = 12 #10am - 10pm
value = ["10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00"
        , "15:00:00", "16:00:00", "17:00:00", "18:00:00", "19:00:00", "20:00:00",
            "21:00:00", "22:00:00"]

partTimeRider = 20
fullTimeRider = 25

def create_array():
    randomValue = random.randrange(10, 48)  #hours worked
    matrix = np.zeros((row,col))

    while randomValue > 0:
        for a in range(row):
            for b in range(col):
                roll = random.randrange(0, 2)
                #print(roll)
                if (roll == 1 and matrix[a][b] == 0):
                    matrix[a][b] = 1
                    randomValue -= 1
                
                if (randomValue <= 0):
                    return matrix

    return matrix

def create_arrayFT():
    roll = random.randrange(0, 2)
    cannotworkday1 = -1
    cannotworkday2 = -1
    if(roll == 1):
        cannotworkday1 = 0
        cannotworkday2 = 1
    else:
        cannotworkday1 = 5
        cannotworkday2 = 6

    matrix = np.zeros((row,col))
    for a in range(row):
        roll = random.randrange(0, 4)
        if (a != cannotworkday1 and a!=cannotworkday2):
            if (roll == 0):
                matrix[a][0] = 1
                matrix[a][1] = 1
                matrix[a][2] = 1
                matrix[a][3] = 1

                matrix[a][5] = 1
                matrix[a][6] = 1
                matrix[a][7] = 1
                matrix[a][8] = 1
            if (roll == 1):
                matrix[a][4] = 1
                matrix[a][1] = 1
                matrix[a][2] = 1
                matrix[a][3] = 1

                matrix[a][6] = 1
                matrix[a][7] = 1
                matrix[a][8] = 1
                matrix[a][9] = 1
            if (roll == 2):
                matrix[a][4] = 1
                matrix[a][5] = 1
                matrix[a][2] = 1
                matrix[a][3] = 1

                matrix[a][10] = 1
                matrix[a][7] = 1
                matrix[a][8] = 1
                matrix[a][9] = 1
            if (roll == 3):
                matrix[a][4] = 1
                matrix[a][5] = 1
                matrix[a][6] = 1
                matrix[a][3] = 1

                matrix[a][10] = 1
                matrix[a][11] = 1
                matrix[a][8] = 1
                matrix[a][9] = 1

    return matrix

#for part time cause its random
def checkconstrain1(matrix): 
    count = 0
    for a in range(row):
        for b  in range(col):
            if(matrix[a][b] == 0):
                count = 0
            if (matrix[a][b] == 1):
                count+=1
            if(count > 4):
                return False
        count = 0 
    return True

def create_arrayPT():
    a = create_array()
    while(not checkconstrain1(a)):
        a = create_array()
    return a

def generateInterval(matrix):
    array1 = []
    for a in range(row):
        start = -1
        end = -1
        for b in range(col):
          #  print(a, b, start, end)

            if(matrix[a][b] == 1):
                if(start == -1):
                    start = b
                    end = b
                if(start != -1):
                    end = b

            if(matrix[a][b] == 0 and start != -1):
                temparr = [a, value[start], value[end+1]]
                array1.append(temparr)
                start = -1 
                end = -1
            elif (b == col-1 and start != -1):
                temparr = [a, value[start], value[end+1]]
                array1.append(temparr)
                start = -1 
                end = -1
        start = -1
        end = -1
    return array1

weeklywork = []
intervals = []
noPartTime = partTimeRider

def generateWeeklyWorkSchedule(startDate, riderNo):
    enddate = startDate + timedelta(days = 6)
   ## startdate = date(2020, 1, 1).strftime("%Y-%m-%d") convert to string
    tempArr = [riderNo, startDate, enddate] ##something wrong
    weeklywork.append(tempArr)

def generateIntervalFinal(scheduleId, matrix, startDate):

    IntervalArr = generateInterval(matrix)

    lengthMatrix = len(IntervalArr)
    for i in range(lengthMatrix):

        changedStartDate = startDate + timedelta(days = IntervalArr[i][0])

        startDateWithoutHHSS = changedStartDate.strftime("%Y-%m-%d") #tostring

        intervalString = startDateWithoutHHSS + " " + IntervalArr[i][1]
        intervalString2 = startDateWithoutHHSS + " " + IntervalArr[i][2]
        #print(intervalString)
        #print(intervalString2)

        tempArr = [scheduleId, intervalString, intervalString2]
        intervals.append(tempArr)

lastcount = 1

def generateAllWeeklyWorkSchedule(totalPartTimeRider, startingUserIdPartTimeRider):
    randomIntervalsBetweenWeeksTotal = 0
    commonStartDate = datetime(2019, 1, 1)
    count = 1

    for i in range(totalPartTimeRider):
        randomIntervalsBetweenWeeksTotal = 0
        numberOfTimes = random.randrange(40,50) #change here
        #numberOfTimes = 1
        for a in range(numberOfTimes):

            startDate = commonStartDate + timedelta(days = randomIntervalsBetweenWeeksTotal)
            generateIntervalFinal(count, create_arrayPT(), startDate)

            generateWeeklyWorkSchedule(startDate, startingUserIdPartTimeRider+i)
            randomDaysBetweenWeeks = random.randrange(1,5)
            randomIntervalsBetweenWeeksTotal += 6
            randomIntervalsBetweenWeeksTotal += randomDaysBetweenWeeks 
            count += 1

    return count


monthlyworkFT = []
weeklyworkFT = []
intervalsFT = []

def generateWeeklyWorkScheduleForFT(startDate, riderNo):
    enddate = startDate + timedelta(days = 6)
   ## startdate = date(2020, 1, 1).strftime("%Y-%m-%d") convert to string
    tempArr = [riderNo, startDate, enddate] ##something wrong
    weeklyworkFT.append(tempArr)

def generateIntervalFinalFT(scheduleId, matrix, startDate):

    IntervalArr = generateInterval(matrix)

    lengthMatrix = len(IntervalArr)
    for i in range(lengthMatrix):

        changedStartDate = startDate + timedelta(days = IntervalArr[i][0])

        startDateWithoutHHSS = changedStartDate.strftime("%Y-%m-%d") #tostring

        intervalString = startDateWithoutHHSS + " " + IntervalArr[i][1]
        intervalString2 = startDateWithoutHHSS + " " + IntervalArr[i][2]
        #print(intervalString)
        #print(intervalString2)

        tempArr = [scheduleId, intervalString, intervalString2]
        intervalsFT.append(tempArr)

def generateAllWeeklyWorkScheduleFt(totalFullTimeRider, startingUserIdFullTimeRider, scheduleId):
    randomIntervalsBetweenWeeksTotal = 0
    commonStartDate = datetime(2019, 1, 1)
    count = scheduleId

    for i in range(totalFullTimeRider):
        randomIntervalsBetweenWeeksTotal = 0
        #numberOfTimes = 1  #change here
        numberOfTimes = 11
        for a in range(numberOfTimes):
            
            arr = create_arrayFT()

            startDate = commonStartDate + timedelta(days = randomIntervalsBetweenWeeksTotal)
            generateIntervalFinalFT(count, arr, startDate)
            generateWeeklyWorkScheduleForFT(startDate, startingUserIdFullTimeRider+i)
            randomIntervalsBetweenWeeksTotal += 7
            count += 1
            
            startDate = commonStartDate + timedelta(days = randomIntervalsBetweenWeeksTotal)
            generateIntervalFinalFT(count, arr, startDate)
            generateWeeklyWorkScheduleForFT(startDate, startingUserIdFullTimeRider+i)
            randomIntervalsBetweenWeeksTotal += 7
            count += 1
            
            startDate = commonStartDate + timedelta(days = randomIntervalsBetweenWeeksTotal)
            generateIntervalFinalFT(count, arr, startDate)
            generateWeeklyWorkScheduleForFT(startDate, startingUserIdFullTimeRider+i)
            randomIntervalsBetweenWeeksTotal += 7
            count += 1
            
            startDate = commonStartDate + timedelta(days = randomIntervalsBetweenWeeksTotal)
            generateIntervalFinalFT(count, arr, startDate)
            generateWeeklyWorkScheduleForFT(startDate, startingUserIdFullTimeRider+i)
            randomIntervalsBetweenWeeksTotal += 7
            count += 1

            scheduleId4 = count - 1
            scheduleId3 = count - 2
            scheduleId2 = count - 3
            scheduleId1 = count - 4

            generateMonthlyWorkScheduleForFT(scheduleId1, scheduleId2, scheduleId3, scheduleId4)

            randomIntervalsBetweenWeeksTotal += random.randrange(0,5)

def generateMonthlyWorkScheduleForFT(scheduleId1, scheduleId2, scheduleId3, scheduleId4):
    temparr = [scheduleId1, scheduleId2,scheduleId3,scheduleId4]
    monthlyworkFT.append(temparr)

timeOforders = []

def generateOrderTimeOfOrder():
    startDate = datetime(2019, 2, 1)
    noOfDays = 330 #already generated for january change here
    for a in range(noOfDays): 
        currentDate = startDate + timedelta(days = a)
        noOfOrdersPerday = random.randrange(1,2) #random.randrange(40,80) #change here remember to order first before inserting 100 orders per day is no issue
        for b in range(noOfOrdersPerday):
            dateString = currentDate.strftime("%Y-%m-%d") #tostring
            hh = random.randrange(10, 22)
            mm = random.randrange(0, 60)
            ss = random.randrange(0, 60)
            timeStamp = dateString + " " + str(hh) + ":" + str(mm).zfill(2) + ":" + str(ss).zfill(2)
            temp = [timeStamp]
            timeOforders.append(temp)

def convert_to_csv(data, filename):
    f = open(filename, 'w', newline='')
    with f:
        writer = csv.writer(f)
        if(filename == 'weeklywork.csv' or filename == 'weeklyworkFT.csv'):
            writer.writerow(['userId', 'startDate', 'endDate'])
        if(filename == 'intervals.csv' or filename == 'intervalsFT.csv'):
            writer.writerow(['scheduleId', 'startTime', 'endTime'])
        if(filename == 'monthlyworkFT.csv'):
            writer.writerow(['scheduleId1', 'scheduleId2', 'scheduleId3', 'scheduleId4'])

        #For smaller test set
        if(filename == 'smallweeklywork.csv' or filename == 'smallweeklyworkFT.csv'):
            writer.writerow(['userId', 'startDate', 'endDate'])
        if(filename == 'smallintervals.csv' or filename == 'smallintervalsFT.csv'):
            writer.writerow(['scheduleId', 'startTime', 'endTime'])
        if(filename == 'smallmonthlyworkFT.csv'):
            writer.writerow(['scheduleId1', 'scheduleId2', 'scheduleId3', 'scheduleId4'])

        if(filename == 'MoreOrders.csv'):
            writer.writerow(['timeOfOrder'])

        for row in data:
            writer.writerow(row)

generateOrderTimeOfOrder()
#print(timeOforders)
convert_to_csv(timeOforders, 'MoreOrders.csv')

"""
a = create_array()
while(not checkconstrain1(a)):
    a = create_array()

print(a)

a = create_arrayFT()

print(a)

b = create_arrayFT()
print(b)
a = generateInterval(b)
print(a)
"""
"""
scheduleId = generateAllWeeklyWorkSchedule(20,41) #20 parttime rider start from userid 40
convert_to_csv(weeklywork, 'smallweeklywork.csv')
convert_to_csv(intervals, 'smallintervals.csv')


generateAllWeeklyWorkScheduleFt(25,61, scheduleId) #25 fulltime rider start from userid 40
convert_to_csv(weeklyworkFT, 'smallweeklyworkFT.csv')
convert_to_csv(intervalsFT, 'smallintervalsFT.csv')
convert_to_csv(monthlyworkFT, 'smallmonthlyworkFT.csv')

"""

"""

scheduleId = generateAllWeeklyWorkSchedule(20,41) #20 parttime rider start from userid 40
convert_to_csv(weeklywork, 'weeklywork.csv')
convert_to_csv(intervals, 'intervals.csv')


generateAllWeeklyWorkScheduleFt(25,61, scheduleId) #25 fulltime rider start from userid 61
convert_to_csv(weeklyworkFT, 'weeklyworkFT.csv')
convert_to_csv(intervalsFT, 'intervalsFT.csv')
convert_to_csv(monthlyworkFT, 'monthlyworkFT.csv')
"""