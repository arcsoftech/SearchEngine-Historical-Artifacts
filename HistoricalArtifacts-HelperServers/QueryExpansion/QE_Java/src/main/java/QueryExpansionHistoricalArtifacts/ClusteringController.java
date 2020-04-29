package QueryExpansionHistoricalArtifacts;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class ClusteringController {


    private final AtomicLong counter = new AtomicLong();
    private String expanded_query="";

    @RequestMapping("/queryexpansion")
    public Clustering queryexpansion(@RequestParam(value="query", defaultValue="pyramid") String query, @RequestParam(value = "qe",defaultValue = "association") String qe) {
        return new Clustering(counter.incrementAndGet(), query,expanded_query,qe);
    }

}
