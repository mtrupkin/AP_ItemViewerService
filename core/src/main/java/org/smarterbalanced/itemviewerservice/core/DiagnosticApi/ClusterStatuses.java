package org.smarterbalanced.itemviewerservice.core.DiagnosticApi;

import org.w3c.dom.Document;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlElements;
import javax.xml.bind.annotation.XmlList;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.LinkedList;
import java.util.List;

@XmlRootElement(name = "status")
public class ClusterStatuses {

  @XmlAttribute
  private Integer statusRating;

  @XmlAttribute
  private String statusText;

  @XmlAttribute(name = "time")
  private String time;

  @XmlElement(name = "status")
  private List<DiagnosticApi> clusterStatuses;

  /* DO NOT REMOVE
     This empty constructor is used by the xml serializer.
   */
  ClusterStatuses() {
    //This space intentionally left blank
  }

  ClusterStatuses(Integer rating, List<DiagnosticApi> statuses) {
    this.statusRating = rating;
    this.statusText = BaseDiagnostic.convertToStatusText(rating);
    this.clusterStatuses = statuses;
    this.time = DiagnosticApi.generateTimestamp();
  }
}
