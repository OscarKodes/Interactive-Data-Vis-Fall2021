
## Clear Everything
rm(list = ls())

## Set working directory
setwd("C:/Users/Oscar Ko/Desktop/Interactive-Data-Vis-Fall2021/3_1_quantities_and_amounts")

## Get working directory
getwd()

## Get data
data <- read.csv("OscarsRace.csv")

## library
library(tidyverse)

## Examine data
head(data)
tail(data)
str(data)
summary(data)
colnames(data)

## Select only Race column
raceData <- select(data, race_ethnicity)

head(raceData)
unique(raceData)

## Count races and record into vectors
races <- c("White", "Asian", "Hispanic", "Black", "Multiracial", "Middle Eastern")
count <- c()

for(i in 1:length(races)) {
  
  filter_others <- raceData[raceData$race_ethnicity == races[i], ]
  count[i] <- length(filter_others)
}

## Create data frame
df <- data.frame(races, count)

write.csv(df, "CLEANED_OscarRaces.csv")










