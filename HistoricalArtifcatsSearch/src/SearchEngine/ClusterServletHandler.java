package SearchEngine;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Servlet implementation class ClusterServletHandler
 */
@WebServlet("/ClusterServletHandler")
public class ClusterServletHandler extends HttpServlet {
	
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		
		String query = request.getParameter("query");
		String type = request.getParameter("type");

		try {
			
			JSONObject clusterJSONObj = APICallHandler.clusterCall(query,type);
			
			JSONObject jsonObject = new JSONObject();
			
			jsonObject.put("clust", clusterJSONObj);
			response.setCharacterEncoding("UTF-8");
			response.getWriter().print(jsonObject.toString());

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
