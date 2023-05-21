import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Col,
} from "reactstrap";
// ** React Imports
import { Fragment, useEffect } from "react";

// ** Third Party Components
import Prism from "prismjs";
import Autocomplete from "@components/autocomplete";
import { useState } from "react";
import axios from "axios";

const SecondPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/medecine/all")
      .then((response) => setSuggestions(response.data.items));
  }, []);
  return (
    <Card>
      <Row>
        <Col xl="6" lg="12">
          <Autocomplete
            suggestions={suggestions}
            className="form-control"
            filterKey="title"
            suggestionLimit={4}
            placeholder="Search for any of the top 250 IMDB movies"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default SecondPage;
