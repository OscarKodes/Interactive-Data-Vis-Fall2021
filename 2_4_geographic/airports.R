
## SETUP ===========================================

## Clear R's memory.
rm(list=ls())

## Check how much memory in hard drive
gc()

## Set working directory
setwd("C:/Users/Oscar Ko/Desktop/Interactive-Data-Vis-Fall2021/2_4_geographic")

## Check current working directory
getwd()

## Lists files in current working directory
list.files()

## PACKAGES ===========================================

library(tidyverse) # ggplot2, dplyr, tidyr, readr, etc.


## IMPORT FILES ===========================================

## different ways to import data through CSV file
data <- read_csv("airports.csv", col_names = TRUE)


# Examine Data
head(data)
colnames(data)
head(data$score)

# type-size for size of dot, name, latitude, longitude, last updated

# Select wanted columns
exportData <- select(data, type, name, latitude_deg, longitude_deg, last_updated)
head(exportData)

# Clean: remove top row
exportData2 <- exportData[-1,]
head(exportData2)

# Rename columns
colnames(exportData2) <- c("Size", "Name", "lat", "long", "last_update")

# Examine Data
head(exportData2)
str(exportData2)
summary(exportData2)

# See unique values of column Size
unique(exportData2$Size, incomparables = FALSE)

# Filter for only normal airports
exportData3 <- exportData2[exportData2$Size %in% c("large_airport", "medium_airport", "small_airport"),]

# Check to see filter worked
unique(exportData3$Size, incomparables = FALSE)

# Recode to 3, 2, 1
exportData3$Size <- recode(exportData3$Size, "large_airport" = 3, "medium_airport" = 2, "small_airport" = 1)

# Check results to see if all good
head(exportData3)

# Export
write.csv(exportData3,"airport-clean-data.csv", row.names = FALSE)

