## DycomDetector: Discover topics using automatic community detections in dynamic networks
Please click to watch the overview video.

[![ScreenShot](https://github.com/iDataVisualizationLab/DycomDetector/blob/master/dycomthumb.png)](https://youtu.be/Sk1rde-C0Pc)
Online demo:  https://idatavisualizationlab.github.io/DycomDetector/

Due to the rapid expansion and heterogeneity of the data, it is a challenging task to find out the patterns and relationships in the data. We introduce DycomDetector, a novel visualization tools for representing the relationships of temporal datasets. Our algorithm extracts the topics and creates relationships based on the collocation of the terms from the real world datasets such as political blogs. Based on the relationships and frequency of the words, DycomDetector constructs networks of a particular period and show the communities in the networks. The interactive and intuitive interface of our system enables the users to explore the data using various filter and lensing, to construct the networks using various parameters such as sudden change, degree, betweenness centrality, etc. It also allows the users to search a particular topic and visualize the relations of that topic with others terms in different time points. 

We collected 90,811 political blog posts over a ten-year period from 2005 to 2015 from seven different sources, including Wikinews, Americablog, The Huffington Post, and ProPublica. We then ran text analysis on these blogs and generated 418,641 terms that were classified into four different categories. We demonstrate the application of the DycomDetector on those datasets to analyze and evaluate its capabilities. 

### Exploring Topics and Events using DycomDetector
The following image shows the visualization of 7290 terms from 11267 political blog posts in last 10 years. We considered around 100,000 blogs of different datasets from which we filter and process the above terms and blog posts using topic modeling to find the important and meaningful terms. The terms which are collocated in same political blogs are brought closer and connected by arcs. The arc thickness indicates the frequency of collocated terms. The key features of DycomDetector are:

**Box A:** The users can search and explore the relation of a particular term with other terms using the search box. It will filter the topics and process the data only related to the search term.

**Box B:** The cut-off value helps a user to see the terms which have a stronger relation. Based on the terms collocation this value is determined. A cut-off value of 5, filters the words which appear more than five times together.

**Box C:** This interactive drop-down selection helps a user to redefined the vertices based on the network properties such as Frequency, Net frequency, Degree, and Betweenness centrality.

**Box D:** The processed terms and blogs information are shown here. Terms are color-coded by categories as depicted on the box D.

**Box E:** The users can get a quick overview of the terms and events by this area. The most frequent terms and their relations are shown here.

**Box F:** The viewers can lens into a period to see the details by mousing over the time axis. The following figure depicts lensing into the year of 2012.

![ScreenShot](https://github.com/iDataVisualizationLab/DycomDetector/blob/master/images/DycomDetector.png)

### DycomDetector on the Huffington Post with lensing
The following figure depicts the related topics in the Huffington Post for the input term "tucson". The terms are ordered based on the betweenness centrality which defined the most central topics. For example, "newtown" and "sandy hook" are the two central terms appearing on many political blogs due to the shooting event at the Sandy Hook Elementary School shooting occurred on December 14, 2012, in Newtown, Connecticut. This visualization enable a user to quickly get a brief idea about the event on that specific time.

![ScreenShot](https://github.com/iDataVisualizationLab/DycomDetector/blob/master/images/tucson.png)

### DycomDetector on the Esquire blog with lensing into 2012
The following image shows the top 5 terms under modularity histograms are ordered by betweenness centrality. For example, "willard", "politico", and "boston" globe are the hottest topics in July 2012.

![ScreenShot](https://github.com/iDataVisualizationLab/DycomDetector/blob/master/images/Esquire.png)






