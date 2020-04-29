package SearchEngine;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import java.util.HashMap;

import org.json.*;
import static java.nio.charset.StandardCharsets.*;


public class APICallHandler {
	public static JSONArray bingCall(String searchText) throws IOException, JSONException {
		final String accountKey = "dfe47a9d898c49bd93ccf59bb49caeb3";
		final String bingUrlPattern = "https://myprojectapi.cognitiveservices.azure.com/bing/v7.0/search?q=%s&count=15&offset=0&mkt=en-us&safesearch=Moderate";
		
		final String query = URLEncoder.encode(searchText, Charset.defaultCharset().name());
		final String bingUrl = String.format(bingUrlPattern, query);
		System.out.println(bingUrl);
		//final String accountKeyEnc = Base64.getEncoder().encodeToString((accountKey + ":" + accountKey).getBytes());
		
		final URL url = new URL(bingUrl);
		final URLConnection connection = url.openConnection();
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", accountKey);
		
		try (final BufferedReader in = new BufferedReader(
				new InputStreamReader(connection.getInputStream()))) {
			String inputLine;
			final StringBuilder response = new StringBuilder();
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			final JSONObject json = new JSONObject(response.toString());
			final JSONObject d = json.getJSONObject("webPages");
			final JSONArray results = d.getJSONArray("value");
			return results;
		
		}
	}

	public static JSONArray googleCall(String searchText) throws IOException,
		JSONException {
		String key = "AIzaSyBzzNuu2KUjWFAnrzLoNBvxN9dcerAWl-Q"; //
		String cref = "000919623271246924971:skhhkxaozmy"; //
		URL url = new URL("https://www.googleapis.com/customsearch/v1?key="
				+ key + "&cx=" + cref + "&q="
				+ URLEncoder.encode(searchText, "UTF-8") + "&alt=json");
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		
		connection.setRequestMethod("GET");
		connection.setRequestProperty("Accept", "application/json");
		BufferedReader br = new BufferedReader(new InputStreamReader(
				connection.getInputStream()));
		String line;
		final StringBuilder response = new StringBuilder();
		JSONArray items = null;
		while ((line = br.readLine()) != null) {
			response.append(line);
		}
		if (response != null) {
			JSONObject obj = new JSONObject(response.toString());
			items = obj.getJSONArray("items");
		
		}
		
		return items;
	}
	
	public static JSONArray solrCall(String searchText, int maxRows) throws IOException,
		JSONException {
	
		final String solrQuery = "http://localhost:8983/solr/nutch/select?q=content:"
				+ URLEncoder.encode(searchText, "UTF-8")
				+ "&rows="+maxRows+"&wt=json&indent=true";
		
		System.out.println(solrQuery);
		final URL url = new URL(solrQuery);
		final URLConnection connection = url.openConnection();
		final BufferedReader in = new BufferedReader(new InputStreamReader(
				connection.getInputStream(), StandardCharsets.UTF_8));
		String inputLine;
		final StringBuilder response = new StringBuilder();
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		JSONObject items = null;
		JSONArray dataArray = null;
		if (response != null) {
			JSONObject obj = new JSONObject(response.toString());
			// System.out.println(response.toString());
			items = obj.getJSONObject("response");
			dataArray = items.getJSONArray("docs");
		}
		
		return dataArray;
	}
	public static JSONArray PageRankCall(JSONArray result) throws IOException,
	JSONException {
		String searchText="";
		Map<String, JSONObject> jsonMap=new HashMap<String,JSONObject>();
		for (int i = 0; i < result.length(); i++) {
		    JSONObject jsonobject = result.getJSONObject(i);
		    String url = jsonobject.getJSONArray("url").getString(0);
		    byte[] ptext = url.getBytes(UTF_8); 
		    url=  new String(ptext, UTF_8); 
		    searchText += url + ",";
		    jsonMap.put(url, jsonobject);
		}
	
		JSONObject solrResults = new JSONObject();
		solrResults.put("result", searchText);
		final URL url = new URL("http://127.0.0.1:5000/getHITS/false");
		HttpURLConnection httpCon = (HttpURLConnection) url.openConnection();
		httpCon.setDoOutput(true);
		httpCon.setDoInput(true);
		httpCon.setUseCaches(false);
		httpCon.setRequestProperty( "Content-Type", "application/json" );
		httpCon.setRequestProperty("Accept", "application/json");
		httpCon.setRequestMethod("POST");
		OutputStream os = httpCon.getOutputStream();
		OutputStreamWriter osw = new OutputStreamWriter(os, "UTF-8");
		osw.write(solrResults.toString());
		osw.flush();
		osw.close();    
		os.close();  
		
		final BufferedReader in = new BufferedReader(new InputStreamReader(
				httpCon.getInputStream(), StandardCharsets.UTF_8));
		String inputLine;
		final StringBuilder response = new StringBuilder();
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		JSONArray items = null;
		JSONArray data = new JSONArray();
		if (response != null) {
			JSONObject obj = new JSONObject(response.toString());
			// System.out.println(response.toString());
			items = obj.getJSONArray("a_score");
			for(int j = 0;j<items.length();j++){
				data.put(jsonMap.get(items.optString(j)));
			}
		}
		//System.out.println(data.toString());
		return data;
	}
	public static JSONArray hitsCall(JSONArray result) throws IOException,
	JSONException {
		String searchText="";
		Map<String, JSONObject> jsonMap=new HashMap<String,JSONObject>();
		for (int i = 0; i < result.length(); i++) {
		    JSONObject jsonobject = result.getJSONObject(i);
		    String url = jsonobject.getJSONArray("url").getString(0);
		    byte[] ptext = url.getBytes(UTF_8); 
		    url=  new String(ptext, UTF_8); 
		    searchText += url + ",";
		    jsonMap.put(url, jsonobject);
		}
	
		JSONObject solrResults = new JSONObject();
		solrResults.put("result", searchText);
		final URL url = new URL("http://127.0.0.1:5000/getHITS/true");
		HttpURLConnection httpCon = (HttpURLConnection) url.openConnection();
		httpCon.setDoOutput(true);
		httpCon.setDoInput(true);
		httpCon.setUseCaches(false);
		httpCon.setRequestProperty( "Content-Type", "application/json" );
		httpCon.setRequestProperty("Accept", "application/json");
		httpCon.setRequestMethod("POST");
		OutputStream os = httpCon.getOutputStream();
		OutputStreamWriter osw = new OutputStreamWriter(os, "UTF-8");
		osw.write(solrResults.toString());
		osw.flush();
		osw.close();    
		os.close();  
		
		final BufferedReader in = new BufferedReader(new InputStreamReader(
				httpCon.getInputStream(), StandardCharsets.UTF_8));
		String inputLine;
		final StringBuilder response = new StringBuilder();
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		JSONArray items = null;
		JSONArray data = new JSONArray();
		if (response != null) {
			JSONObject obj = new JSONObject(response.toString());
			// System.out.println(response.toString());
			items = obj.getJSONArray("a_score");
			for(int j = 0;j<items.length();j++){
				data.put(jsonMap.get(items.optString(j)));
			}
		}
		//System.out.println(data.toString());
		return data;

	}
	
	
	public static JSONObject queryExpCall(String query, String type) throws IOException,
	JSONException {
		query = query.replaceAll(" ", ",");
		JSONArray result = APICallHandler.solrCall(query, 2);
		final URL url = new URL("http://127.0.0.1:8080/queryexpansion?query="+query+"&qe="+type);
		final URLConnection connection = url.openConnection();
		final BufferedReader in = new BufferedReader(new InputStreamReader(
				connection.getInputStream(), StandardCharsets.UTF_8));
		String inputLine;
		final StringBuilder response = new StringBuilder();
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		String newQuery = null;
		
		if (response != null) {
			JSONObject obj = new JSONObject(response.toString());
			// System.out.println(response.toString());
			newQuery = obj.optString("expanded_query");
			
		}
		JSONArray res = APICallHandler.solrCall(newQuery, 15);
		JSONObject finRes = new JSONObject();
		finRes.put("newQuery", newQuery);
		finRes.put("result", res);
		return finRes;
	}
	
	public static JSONObject clusterCall(String query, String type) throws IOException,
	JSONException {
		JSONArray result = APICallHandler.solrCall(query, 100);
		JSONObject solrResults = new JSONObject();
		solrResults.put("results", result);
		final URL url = new URL("http://127.0.0.1:5001/getCluster/"+type);
		HttpURLConnection httpCon = (HttpURLConnection) url.openConnection();
		httpCon.setDoOutput(true);
		httpCon.setDoInput(true);
		httpCon.setUseCaches(false);
		httpCon.setRequestProperty( "Content-Type", "application/json" );
		httpCon.setRequestProperty("Accept", "application/json");
		httpCon.setRequestMethod("POST");
		OutputStream os = httpCon.getOutputStream();
		OutputStreamWriter osw = new OutputStreamWriter(os, "UTF-8");
		osw.write(solrResults.toString());
		osw.flush();
		osw.close();    
		os.close();  
		
		final BufferedReader in = new BufferedReader(new InputStreamReader(
				httpCon.getInputStream(), StandardCharsets.UTF_8));
		String inputLine;
		final StringBuilder response = new StringBuilder();
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		JSONObject newObj = null;
		
		if (response != null) {
			JSONObject obj = new JSONObject(response.toString());
			// System.out.println(response.toString());
			newObj = obj.getJSONObject("results");
			
		}		
		return newObj;
	}
	public static JSONArray clusterCall2(String query) throws IOException,
	JSONException {
		JSONArray result = APICallHandler.solrCall(query, 100);
		JSONObject solrResults = new JSONObject();
		solrResults.put("results", result);
		final URL url = new URL("http://127.0.0.1:5002/getAgglomerativeClusteringResults/");
		HttpURLConnection httpCon = (HttpURLConnection) url.openConnection();
		httpCon.setDoOutput(true);
		httpCon.setDoInput(true);
		httpCon.setUseCaches(false);
		httpCon.setRequestProperty( "Content-Type", "application/json" );
		httpCon.setRequestProperty("Accept", "application/json");
		httpCon.setRequestMethod("POST");
		OutputStream os = httpCon.getOutputStream();
		OutputStreamWriter osw = new OutputStreamWriter(os, "UTF-8");
		osw.write(solrResults.toString());
		osw.flush();
		osw.close();    
		os.close();  
		
		final BufferedReader in = new BufferedReader(new InputStreamReader(
				httpCon.getInputStream(), StandardCharsets.UTF_8));
		String inputLine;
		final StringBuilder response = new StringBuilder();
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		JSONArray newObj = null;
		
		if (response != null) {
			JSONObject obj = new JSONObject(response.toString());
			// System.out.println(response.toString());
			newObj = obj.getJSONArray("results");
			
		}		
		return newObj;
	}
	public static JSONArray clusterCall3(String query) throws IOException,
	JSONException {
		JSONArray result = APICallHandler.solrCall(query, 100);
		JSONObject solrResults = new JSONObject();
		solrResults.put("results", result);
		final URL url = new URL("http://127.0.0.1:5003/getAgglomerativeClusteringResults/");
		HttpURLConnection httpCon = (HttpURLConnection) url.openConnection();
		httpCon.setDoOutput(true);
		httpCon.setDoInput(true);
		httpCon.setUseCaches(false);
		httpCon.setRequestProperty( "Content-Type", "application/json" );
		httpCon.setRequestProperty("Accept", "application/json");
		httpCon.setRequestMethod("POST");
		OutputStream os = httpCon.getOutputStream();
		OutputStreamWriter osw = new OutputStreamWriter(os, "UTF-8");
		osw.write(solrResults.toString());
		osw.flush();
		osw.close();    
		os.close();  
		
		final BufferedReader in = new BufferedReader(new InputStreamReader(
				httpCon.getInputStream(), StandardCharsets.UTF_8));
		String inputLine;
		final StringBuilder response = new StringBuilder();
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		JSONArray newObj = null;
		
		if (response != null) {
			JSONObject obj = new JSONObject(response.toString());
			// System.out.println(response.toString());
			newObj = obj.getJSONArray("results");
			
		}		
		return newObj;
	}
	public static JSONArray clusterCall4(String query) throws IOException,
	JSONException {
		JSONArray result = APICallHandler.solrCall(query, 100);
		JSONObject solrResults = new JSONObject();
		solrResults.put("results", result);
		final URL url = new URL("http://127.0.0.1:5004/getAgglomerativeClusteringResults/");
		HttpURLConnection httpCon = (HttpURLConnection) url.openConnection();
		httpCon.setDoOutput(true);
		httpCon.setDoInput(true);
		httpCon.setUseCaches(false);
		httpCon.setRequestProperty( "Content-Type", "application/json" );
		httpCon.setRequestProperty("Accept", "application/json");
		httpCon.setRequestMethod("POST");
		OutputStream os = httpCon.getOutputStream();
		OutputStreamWriter osw = new OutputStreamWriter(os, "UTF-8");
		osw.write(solrResults.toString());
		osw.flush();
		osw.close();    
		os.close();  
		
		final BufferedReader in = new BufferedReader(new InputStreamReader(
				httpCon.getInputStream(), StandardCharsets.UTF_8));
		String inputLine;
		final StringBuilder response = new StringBuilder();
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		JSONArray newObj = null;
		
		if (response != null) {
			JSONObject obj = new JSONObject(response.toString());
			// System.out.println(response.toString());
			newObj = obj.getJSONArray("results");
			
		}		
		return newObj;
	}
}
